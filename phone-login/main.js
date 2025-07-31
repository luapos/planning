// State management
const appState = {
    phoneNumber: null,
    uuid: null,
    countdownInterval: null,
    timeRemaining: 60,
    isProcessing: false
};

// DOM Elements
const phoneInputScreen = document.getElementById('phone-input-screen');
const otpInputScreen = document.getElementById('otp-input-screen');
const phoneInput = document.getElementById('phone-input');
const phoneDisplay = document.getElementById('phone-display');
const phoneError = document.getElementById('phone-error');
const otpError = document.getElementById('otp-error');
const requestOtpBtn = document.getElementById('request-otp-btn');
const requestOtpBtnText = document.getElementById('request-otp-btn-text');
const requestOtpBtnLoading = document.getElementById('request-otp-btn-loading');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const verifyOtpBtnText = document.getElementById('verify-otp-btn-text');
const verifyOtpBtnLoading = document.getElementById('verify-otp-btn-loading');
const resendOtpBtn = document.getElementById('resend-otp-btn');
const changePhoneBtn = document.getElementById('change-phone-btn');
const countdownEl = document.getElementById('countdown');
const otpDigits = document.querySelectorAll('.otp-digit');

// Initialize the app
function init() {
    // Event Listeners
    requestOtpBtn.addEventListener('click', handleRequestOtp);
    verifyOtpBtn.addEventListener('click', handleVerifyOtp);
    resendOtpBtn.addEventListener('click', handleResendOtp);
    changePhoneBtn.addEventListener('click', handleChangePhone);
    phoneInput.addEventListener('input', formatPhoneNumber);

    // OTP input handling - convert to number inputs for mobile
    otpDigits.forEach(input => {
        input.type = "tel"; // Better for mobile numeric keypads
        input.addEventListener('input', handleOtpDigitInput);
        input.addEventListener('keydown', handleOtpKeyDown);
        input.addEventListener('focus', function() {
            this.select();
        });
    });
}

// Phone number validation and formatting
function formatPhoneNumber(e) {
    // Allow only numbers
    let value = e.target.value.replace(/\D/g, '');

    // Make sure it starts with 0
    if (value.length > 0 && value[0] !== '0') {
        value = '0' + value;
    }

    // Limit to 10 digits
    value = value.substring(0, 10);

    // Apply formatting (0xx) xxx-xxxx
    if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
    }
    if (value.length > 7) {
        value = value.substring(0, 7) + ' ' + value.substring(7);
    }

    e.target.value = value;

    // Clear error message when typing
    hideError(phoneError);
}

// Validate Vietnamese phone number
function validatePhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanPhone) {
        showError(phoneError, "Vui lòng nhập số điện thoại");
        return false;
    }

    if (!phoneRegex.test(cleanPhone)) {
        showError(phoneError, "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng số 0)");
        phoneError.parentNode.classList.add('shake');
        setTimeout(() => {
            phoneError.parentNode.classList.remove('shake');
        }, 500);
        return false;
    }

    return cleanPhone;
}

// Request OTP handler
function handleRequestOtp() {
    if (appState.isProcessing) return; // Prevent multiple clicks

    const validatedPhone = validatePhoneNumber(phoneInput.value);
    if (!validatedPhone) return;

    // Set loading state and processing flag
    appState.isProcessing = true;
    setButtonLoading(requestOtpBtn, true);

    // Mock API call with setTimeout
    setTimeout(() => {
        // Store in app state
        appState.phoneNumber = validatedPhone;
        appState.uuid = "mock-uuid-" + Math.floor(Math.random() * 10000);

        // Update UI
        phoneDisplay.textContent = formatPhoneForDisplay(validatedPhone);

        // Navigate to OTP screen
        showOtpScreen();
        startCountdown();

        // Reset loading state
        setButtonLoading(requestOtpBtn, false);
        appState.isProcessing = false;
    }, 1500);
}

// Format phone for display (e.g., 0912 345 678)
function formatPhoneForDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.substring(0, 4) + ' ' + cleaned.substring(4, 7) + ' ' + cleaned.substring(7);
}

// Show OTP screen with enhanced animation
function showOtpScreen() {
    phoneInputScreen.classList.add('hidden');
    setTimeout(() => {
        otpInputScreen.classList.remove('hidden');
        otpDigits[0].focus();
    }, 100);
}

// Show phone input screen
function showPhoneScreen() {
    otpInputScreen.classList.add('hidden');
    setTimeout(() => {
        phoneInputScreen.classList.remove('hidden');
        phoneInput.focus();
    }, 100);

    // Clear OTP inputs
    otpDigits.forEach(input => input.value = '');

    // Reset countdown
    stopCountdown();
    resetCountdown();
}

// Handle OTP digit input with improved UX
function handleOtpDigitInput(e) {
    const input = e.target;
    const value = input.value;
    const index = parseInt(input.dataset.index);

    // Clear error when typing
    hideError(otpError);

    // If input is not empty
    if (value) {
        // Allow only numbers
        const numValue = value.replace(/\D/g, '');

        if (numValue !== value) {
            input.value = numValue;
        }

        // Move to next input if available
        if (numValue && index < 5) {
            otpDigits[index + 1].focus();
        }

        // Auto-submit when all digits are filled
        if (index === 5) {
            const otp = getOtpValue();
            if (otp.length === 6) {
                setTimeout(() => {
                    verifyOtpBtn.focus();
                }, 200);
            }
        }
    }
}

// Handle OTP keydown events
function handleOtpKeyDown(e) {
    const input = e.target;
    const index = parseInt(input.dataset.index);

    // On backspace, move to previous input if current is empty
    if (e.key === 'Backspace' && !input.value && index > 0) {
        otpDigits[index - 1].focus();
        otpDigits[index - 1].select();
    }
}

// Get OTP from inputs
function getOtpValue() {
    let otp = '';
    otpDigits.forEach(input => {
        otp += input.value || '';
    });
    return otp;
}

// Validate OTP
function validateOtp(otp) {
    if (otp.length !== 6) {
        showError(otpError, "Vui lòng nhập đầy đủ mã OTP 6 số");
        animateShake(otpError.parentNode);
        return false;
    }

    if (!/^\d{6}$/.test(otp)) {
        showError(otpError, "Mã OTP chỉ bao gồm các chữ số");
        animateShake(otpError.parentNode);
        return false;
    }

    return true;
}

// Add shake animation to element
function animateShake(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Verify OTP handler
function handleVerifyOtp() {
    if (appState.isProcessing) return; // Prevent multiple clicks

    const otp = getOtpValue();

    if (!validateOtp(otp)) return;

    // Set loading state and processing flag
    appState.isProcessing = true;
    setButtonLoading(verifyOtpBtn, true);

    // Mock verification with setTimeout
    setTimeout(() => {
        if (otp === "123456") {
            // Success case
            showSuccessMessage("Đăng nhập thành công!");
            // Here you would typically redirect to a dashboard or home page
        } else {
            // Error case
            showError(otpError, "OTP không đúng hoặc đã hết hạn");
            animateShake(otpDigits[0].parentNode);

            // Focus on first digit for re-entering
            setTimeout(() => {
                otpDigits.forEach(input => input.value = '');
                otpDigits[0].focus();
            }, 500);
        }

        // Reset loading state
        setButtonLoading(verifyOtpBtn, false);
        appState.isProcessing = false;
    }, 1500);
}

// Show success message
function showSuccessMessage(message) {
    // Create success overlay
    const successOverlay = document.createElement('div');
    successOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    const successCard = document.createElement('div');
    successCard.className = 'bg-white rounded-xl p-6 max-w-xs w-full text-center shadow-xl';
    successCard.innerHTML = `
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Thành công</h2>
        <p class="text-gray-600 mb-4">${message}</p>
        <button class="bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300">
            Tiếp tục
        </button>
    `;

    successOverlay.appendChild(successCard);
    document.body.appendChild(successOverlay);

    // Add event listener to button
    successOverlay.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(successOverlay);
        // Here you would typically redirect
        alert("Redirect to dashboard or home page");
    });
}

// Handle resend OTP
function handleResendOtp() {
    if (appState.isProcessing) return; // Prevent multiple clicks

    // Set loading state on the resend button
    appState.isProcessing = true;
    resendOtpBtn.textContent = "Đang gửi...";
    resendOtpBtn.disabled = true;

    // Mock resend API call
    setTimeout(() => {
        // Generate new UUID
        appState.uuid = "mock-uuid-" + Math.floor(Math.random() * 10000);

        // Reset and start countdown
        resetCountdown();
        startCountdown();

        // Reset button text
        resendOtpBtn.textContent = "Gửi lại mã";

        // Show notification
        showToast("Mã OTP mới đã được gửi!");

        appState.isProcessing = false;
    }, 1000);
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.textContent = message;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Handle change phone button
function handleChangePhone() {
    showPhoneScreen();
}

// Start countdown timer with pulse animation
function startCountdown() {
    appState.timeRemaining = 60;
    countdownEl.textContent = appState.timeRemaining;
    countdownEl.classList.add('font-bold');
    resendOtpBtn.disabled = true;

    appState.countdownInterval = setInterval(() => {
        appState.timeRemaining--;
        countdownEl.textContent = appState.timeRemaining;

        // Add pulse animation every 10 seconds
        if (appState.timeRemaining % 10 === 0 && appState.timeRemaining > 0) {
            countdownEl.classList.add('animate-pulse');
            setTimeout(() => {
                countdownEl.classList.remove('animate-pulse');
            }, 1000);
        }

        if (appState.timeRemaining <= 0) {
            stopCountdown();
            resendOtpBtn.disabled = false;
            countdownEl.classList.remove('font-bold');
        }
    }, 1000);
}

// Stop countdown timer
function stopCountdown() {
    if (appState.countdownInterval) {
        clearInterval(appState.countdownInterval);
        appState.countdownInterval = null;
    }
}

// Reset countdown
function resetCountdown() {
    appState.timeRemaining = 60;
    countdownEl.textContent = appState.timeRemaining;
}

// Set button loading state - updated to properly handle flex display
function setButtonLoading(button, isLoading) {
    if (button === requestOtpBtn) {
        if (isLoading) {
            requestOtpBtnText.classList.add('hidden');
            requestOtpBtnLoading.classList.remove('hidden');
        } else {
            requestOtpBtnText.classList.remove('hidden');
            requestOtpBtnLoading.classList.add('hidden');
        }
    } else if (button === verifyOtpBtn) {
        if (isLoading) {
            verifyOtpBtnText.classList.add('hidden');
            verifyOtpBtnLoading.classList.remove('hidden');
        } else {
            verifyOtpBtnText.classList.remove('hidden');
            verifyOtpBtnLoading.classList.add('hidden');
        }
    }

    button.disabled = isLoading;
}

// Show error message
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// Hide error message
function hideError(element) {
    element.classList.add('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
