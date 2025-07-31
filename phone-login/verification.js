// State management for verification page
const verificationState = {
    isProcessing: false
};

// DOM Elements
const phoneInput = document.getElementById('phone-input');
const phoneError = document.getElementById('phone-error');
const requestOtpBtn = document.getElementById('request-otp-btn');
const requestOtpBtnText = document.getElementById('request-otp-btn-text');
const requestOtpBtnLoading = document.getElementById('request-otp-btn-loading');

// Initialize the verification page
function init() {
    // Event Listeners
    requestOtpBtn.addEventListener('click', handleRequestOtp);
    phoneInput.addEventListener('input', formatPhoneNumber);
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
        animateShake(phoneError.parentNode);
        return false;
    }

    return cleanPhone;
}

// Add shake animation to element
function animateShake(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Request OTP handler
function handleRequestOtp() {
    if (verificationState.isProcessing) return; // Prevent multiple clicks

    const validatedPhone = validatePhoneNumber(phoneInput.value);
    if (!validatedPhone) return;

    // Set loading state and processing flag
    verificationState.isProcessing = true;
    setButtonLoading(requestOtpBtn, true);

    // Mock API call with setTimeout
    setTimeout(() => {
        // Store phone number and generate UUID in sessionStorage for sharing between pages
        const uuid = "mock-uuid-" + Math.floor(Math.random() * 10000);
        sessionStorage.setItem('phoneNumber', validatedPhone);
        sessionStorage.setItem('uuid', uuid);

        // Reset loading state
        setButtonLoading(requestOtpBtn, false);
        verificationState.isProcessing = false;

        // Redirect to confirm.html page
        window.location.href = "confirm.html";
    }, 1500);
}

// Format phone for display (e.g., 0912 345 678) - Utility function
function formatPhoneForDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.substring(0, 4) + ' ' + cleaned.substring(4, 7) + ' ' + cleaned.substring(7);
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        requestOtpBtnText.classList.add('hidden');
        requestOtpBtnLoading.classList.remove('hidden');
    } else {
        requestOtpBtnText.classList.remove('hidden');
        requestOtpBtnLoading.classList.add('hidden');
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
