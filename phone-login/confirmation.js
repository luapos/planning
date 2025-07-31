// State management for confirmation page
const confirmationState = {
    phoneNumber: null,
    uuid: null,
    countdownInterval: null,
    timeRemaining: 10,
    isProcessing: false
};

// DOM Elements
const phoneDisplay = document.getElementById('phone-display');
const otpError = document.getElementById('otp-error');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const verifyOtpBtnText = document.getElementById('verify-otp-btn-text');
const verifyOtpBtnLoading = document.getElementById('verify-otp-btn-loading');
const resendOtpBtn = document.getElementById('resend-otp-btn');
const changePhoneBtn = document.getElementById('change-phone-btn');
const countdownEl = document.getElementById('countdown');
const otpDigits = document.querySelectorAll('.otp-digit');

// Initialize the confirmation page
function init() {
    // Check if we have the required data from the verification page
    loadSessionData();

    if (!confirmationState.phoneNumber) {
        // Redirect back to the verification page if no phone number is found
        window.location.href = "index.html";
        return;
    }

    // Display the phone number
    phoneDisplay.textContent = formatPhoneForDisplay(confirmationState.phoneNumber);

    // Set up event listeners
    verifyOtpBtn.addEventListener('click', handleVerifyOtp);
    resendOtpBtn.addEventListener('click', handleResendOtp);
    changePhoneBtn.addEventListener('click', handleChangePhone);

    // OTP input handling
    otpDigits.forEach(input => {
        input.type = "tel"; // Better for mobile numeric keypads
        input.addEventListener('input', handleOtpDigitInput);
        input.addEventListener('keydown', handleOtpKeyDown);
        input.addEventListener('focus', function() {
            this.select();
        });
    });

    // Start countdown
    startCountdown();

    // Focus on first OTP digit
    setTimeout(() => {
        otpDigits[0].focus();
    }, 300);
}

// Load data from sessionStorage
function loadSessionData() {
    confirmationState.phoneNumber = sessionStorage.getItem('phoneNumber');
    confirmationState.uuid = sessionStorage.getItem('uuid');
}

// Format phone for display (e.g., 0912 345 678)
function formatPhoneForDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.substring(0, 4) + ' ' + cleaned.substring(4, 7) + ' ' + cleaned.substring(7);
}

// Handle OTP digit input
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
    if (confirmationState.isProcessing) return; // Prevent multiple clicks

    const otp = getOtpValue();

    if (!validateOtp(otp)) return;

    // Set loading state and processing flag
    confirmationState.isProcessing = true;
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
            otpDigits.forEach(input => input.value = '');
            otpDigits[0].focus();
        }

        // Reset loading state
        setButtonLoading(verifyOtpBtn, false);
        confirmationState.isProcessing = false;
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
    if (confirmationState.isProcessing) return; // Prevent multiple clicks

    // Set loading state on the resend button
    confirmationState.isProcessing = true;
    resendOtpBtn.textContent = "Đang gửi...";
    resendOtpBtn.disabled = true;

    // Mock resend API call
    setTimeout(() => {
        // Generate new UUID
        confirmationState.uuid = "mock-uuid-" + Math.floor(Math.random() * 10000);
        sessionStorage.setItem('uuid', confirmationState.uuid);

        // Reset and start countdown
        resetCountdown();
        startCountdown();

        // Reset button text
        resendOtpBtn.textContent = "Gửi lại mã";

        // Show notification
        showToast("Mã OTP mới đã được gửi!");

        confirmationState.isProcessing = false;
    }, 1000);
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-lg opacity-0 transition-opacity duration-300';
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
    // Redirect back to the verification page
    window.location.href = "index.html";
}

// Start countdown timer with pulse animation
function startCountdown() {
    confirmationState.timeRemaining = 10;
    countdownEl.textContent = confirmationState.timeRemaining;
    countdownEl.classList.add('font-bold');
    resendOtpBtn.disabled = true;

    confirmationState.countdownInterval = setInterval(() => {
        confirmationState.timeRemaining--;
        countdownEl.textContent = confirmationState.timeRemaining;

        // Add pulse animation every 10 seconds
        if (confirmationState.timeRemaining % 10 === 0 && confirmationState.timeRemaining > 0) {
            countdownEl.classList.add('animate-pulse');
            setTimeout(() => {
                countdownEl.classList.remove('animate-pulse');
            }, 1000);
        }

        if (confirmationState.timeRemaining <= 0) {
            stopCountdown();
            resendOtpBtn.disabled = false;
            countdownEl.classList.remove('font-bold');
        }
    }, 1000);
}

// Stop countdown timer
function stopCountdown() {
    if (confirmationState.countdownInterval) {
        clearInterval(confirmationState.countdownInterval);
        confirmationState.countdownInterval = null;
    }
}

// Reset countdown
function resetCountdown() {
    confirmationState.timeRemaining = 60;
    countdownEl.textContent = confirmationState.timeRemaining;
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        verifyOtpBtnText.classList.add('hidden');
        verifyOtpBtnLoading.classList.remove('hidden');
    } else {
        verifyOtpBtnText.classList.remove('hidden');
        verifyOtpBtnLoading.classList.add('hidden');
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
