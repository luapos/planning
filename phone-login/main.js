// Main authentication handler
document.addEventListener('DOMContentLoaded', function() {
    // Get screen elements
    const emailScreen = document.getElementById('email-login-screen');
    const phoneScreen = document.getElementById('phone-input-screen');

    // Get buttons
    const continuePhoneBtn = document.getElementById('continue-phone-btn');
    const backToEmailBtn = document.getElementById('back-to-email');
    const continueEmailBtn = document.getElementById('continue-email-btn');

    // Get input elements
    const emailInput = document.getElementById('email-input');
    const emailError = document.getElementById('email-error');

    // Navigation functions
    function showPhoneScreen() {
        emailScreen.classList.add('hidden');
        phoneScreen.classList.remove('hidden');
    }

    function showEmailScreen() {
        phoneScreen.classList.add('hidden');
        emailScreen.classList.remove('hidden');
    }

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showEmailError(message) {
        emailError.textContent = message;
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-error');
    }

    function hideEmailError() {
        emailError.classList.add('hidden');
        emailInput.classList.remove('border-error');
    }

    // Event listeners
    continuePhoneBtn.addEventListener('click', function() {
        showPhoneScreen();
    });

    backToEmailBtn.addEventListener('click', function() {
        showEmailScreen();
    });

    continueEmailBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();

        hideEmailError();

        if (!email) {
            showEmailError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            showEmailError('Please enter a valid email address');
            return;
        }

        // Here you would typically send the email to your backend
        console.log('Email login:', email);
        alert('Email login functionality would be implemented here');
    });

    // Social login handlers
    const socialButtons = document.querySelectorAll('button[class*="border-gray-300"]');

    socialButtons.forEach(button => {
        if (button.querySelector('svg') && !button.id) { // Social buttons have SVG but no ID
            button.addEventListener('click', function() {
                const buttonText = button.querySelector('span').textContent;

                if (buttonText.includes('Google')) {
                    handleGoogleLogin();
                } else if (buttonText.includes('Microsoft')) {
                    handleMicrosoftLogin();
                } else if (buttonText.includes('Apple')) {
                    handleAppleLogin();
                }
            });
        }
    });

    // Social login functions
    function handleGoogleLogin() {
        console.log('Google login initiated');
        // Implement Google OAuth here
        // Example: window.location.href = '/auth/google';
        alert('Google login would be implemented here');
    }

    function handleMicrosoftLogin() {
        console.log('Microsoft login initiated');
        // Implement Microsoft OAuth here
        // Example: window.location.href = '/auth/microsoft';
        alert('Microsoft login would be implemented here');
    }

    function handleAppleLogin() {
        console.log('Apple login initiated');
        // Implement Apple Sign In here
        // Example: window.location.href = '/auth/apple';
        alert('Apple login would be implemented here');
    }

    // Clear errors when user starts typing
    emailInput.addEventListener('input', function() {
        if (emailError.classList.contains('hidden') === false) {
            hideEmailError();
        }
    });

    // Handle Enter key press
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            continueEmailBtn.click();
        }
    });
});

