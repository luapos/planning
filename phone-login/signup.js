// Signup page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get screen elements
    const emailSignupScreen = document.getElementById('email-signup-screen');
    const phoneSignupScreen = document.getElementById('phone-signup-screen');

    // Get buttons
    const continuePhoneBtn = document.getElementById('continue-phone-btn');
    const backToEmailSignupBtn = document.getElementById('back-to-email-signup');
    const createAccountBtn = document.getElementById('create-account-btn');
    const requestSignupOtpBtn = document.getElementById('request-signup-otp-btn');
    const togglePasswordBtn = document.getElementById('toggle-password');

    // Get input elements
    const fullnameInput = document.getElementById('fullname-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const phoneFullnameInput = document.getElementById('phone-fullname-input');
    const phoneInput = document.getElementById('phone-input');
    const phoneTermsCheckbox = document.getElementById('phone-terms-checkbox');

    // Get error elements
    const fullnameError = document.getElementById('fullname-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const termsError = document.getElementById('terms-error');
    const phoneFullnameError = document.getElementById('phone-fullname-error');
    const phoneError = document.getElementById('phone-error');
    const phoneTermsError = document.getElementById('phone-terms-error');

    // Get loading elements
    const createAccountText = document.getElementById('create-account-text');
    const createAccountLoading = document.getElementById('create-account-loading');
    const requestSignupOtpText = document.getElementById('request-signup-otp-text');
    const requestSignupOtpLoading = document.getElementById('request-signup-otp-loading');

    // Password strength indicators
    const lengthCheck = document.getElementById('length-check');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const lowercaseCheck = document.getElementById('lowercase-check');
    const numberCheck = document.getElementById('number-check');

    // Navigation functions
    function showPhoneSignupScreen() {
        emailSignupScreen.classList.add('hidden');
        phoneSignupScreen.classList.remove('hidden');
    }

    function showEmailSignupScreen() {
        phoneSignupScreen.classList.add('hidden');
        emailSignupScreen.classList.remove('hidden');
    }

    // Validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password)
        };
    }

    function validatePhoneNumber(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Error handling functions
    function showError(errorElement, inputElement, message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        inputElement.classList.add('border-error');
    }

    function hideError(errorElement, inputElement) {
        errorElement.classList.add('hidden');
        inputElement.classList.remove('border-error');
    }

    function updatePasswordStrength(password) {
        const checks = validatePassword(password);

        updateCheck(lengthCheck, checks.length);
        updateCheck(uppercaseCheck, checks.uppercase);
        updateCheck(lowercaseCheck, checks.lowercase);
        updateCheck(numberCheck, checks.number);
    }

    function updateCheck(checkElement, isValid) {
        const indicator = checkElement.querySelector('span');
        if (isValid) {
            indicator.classList.add('bg-success', 'border-success');
            indicator.classList.remove('border-gray-300');
            checkElement.classList.add('text-success');
            checkElement.classList.remove('text-gray-500');
        } else {
            indicator.classList.remove('bg-success', 'border-success');
            indicator.classList.add('border-gray-300');
            checkElement.classList.remove('text-success');
            checkElement.classList.add('text-gray-500');
        }
    }

    // Loading state functions
    function setCreateAccountLoading(loading) {
        if (loading) {
            createAccountText.classList.add('hidden');
            createAccountLoading.classList.remove('hidden');
            createAccountBtn.disabled = true;
        } else {
            createAccountText.classList.remove('hidden');
            createAccountLoading.classList.add('hidden');
            createAccountBtn.disabled = false;
        }
    }

    function setPhoneSignupLoading(loading) {
        if (loading) {
            requestSignupOtpText.classList.add('hidden');
            requestSignupOtpLoading.classList.remove('hidden');
            requestSignupOtpBtn.disabled = true;
        } else {
            requestSignupOtpText.classList.remove('hidden');
            requestSignupOtpLoading.classList.add('hidden');
            requestSignupOtpBtn.disabled = false;
        }
    }

    // Event listeners
    continuePhoneBtn.addEventListener('click', function() {
        showPhoneSignupScreen();
    });

    backToEmailSignupBtn.addEventListener('click', function() {
        showEmailSignupScreen();
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle eye icon
        const eyeIcon = togglePasswordBtn.querySelector('svg');
        if (type === 'text') {
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            `;
        } else {
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            `;
        }
    });

    // Password strength checking
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
        if (!passwordError.classList.contains('hidden')) {
            hideError(passwordError, passwordInput);
        }
    });

    // Email signup form submission
    createAccountBtn.addEventListener('click', function() {
        let isValid = true;

        // Clear previous errors
        hideError(fullnameError, fullnameInput);
        hideError(emailError, emailInput);
        hideError(passwordError, passwordInput);
        hideError(confirmPasswordError, confirmPasswordInput);
        hideError(termsError, termsCheckbox);

        // Validate full name
        const fullname = fullnameInput.value.trim();
        if (!fullname) {
            showError(fullnameError, fullnameInput, 'Please enter your full name');
            isValid = false;
        } else if (fullname.length < 2) {
            showError(fullnameError, fullnameInput, 'Full name must be at least 2 characters');
            isValid = false;
        }

        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            showError(emailError, emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailError, emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        const password = passwordInput.value;
        if (!password) {
            showError(passwordError, passwordInput, 'Please enter a password');
            isValid = false;
        } else {
            const passwordChecks = validatePassword(password);
            if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase || !passwordChecks.number) {
                showError(passwordError, passwordInput, 'Password must meet all requirements');
                isValid = false;
            }
        }

        // Validate confirm password
        const confirmPassword = confirmPasswordInput.value;
        if (!confirmPassword) {
            showError(confirmPasswordError, confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordError, confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }

        // Validate terms
        if (!termsCheckbox.checked) {
            showError(termsError, termsCheckbox, 'You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        if (isValid) {
            setCreateAccountLoading(true);

            // Simulate API call
            setTimeout(() => {
                setCreateAccountLoading(false);
                console.log('Email signup:', { fullname, email, password });
                alert('Account created successfully! Please check your email for verification.');
                // In real app: redirect to email verification page
            }, 2000);
        }
    });

    // Phone signup form submission
    requestSignupOtpBtn.addEventListener('click', function() {
        let isValid = true;

        // Clear previous errors
        hideError(phoneFullnameError, phoneFullnameInput);
        hideError(phoneError, phoneInput);
        hideError(phoneTermsError, phoneTermsCheckbox);

        // Validate full name
        const fullname = phoneFullnameInput.value.trim();
        if (!fullname) {
            showError(phoneFullnameError, phoneFullnameInput, 'Please enter your full name');
            isValid = false;
        } else if (fullname.length < 2) {
            showError(phoneFullnameError, phoneFullnameInput, 'Full name must be at least 2 characters');
            isValid = false;
        }

        // Validate phone number
        const phone = phoneInput.value.trim();
        if (!phone) {
            showError(phoneError, phoneInput, 'Please enter your phone number');
            isValid = false;
        } else if (!validatePhoneNumber(phone)) {
            showError(phoneError, phoneInput, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate terms
        if (!phoneTermsCheckbox.checked) {
            showError(phoneTermsError, phoneTermsCheckbox, 'You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        if (isValid) {
            setPhoneSignupLoading(true);

            // Simulate API call
            setTimeout(() => {
                setPhoneSignupLoading(false);
                console.log('Phone signup:', { fullname, phone });
                alert('Verification code sent! Please check your phone.');
                // In real app: redirect to OTP verification page
            }, 2000);
        }
    });

    // Social signup handlers
    const socialButtons = document.querySelectorAll('button[class*="border-gray-300"]');

    socialButtons.forEach(button => {
        if (button.querySelector('svg') && !button.id) { // Social buttons have SVG but no ID
            button.addEventListener('click', function() {
                const buttonText = button.querySelector('span').textContent;

                if (buttonText.includes('Google')) {
                    handleGoogleSignup();
                } else if (buttonText.includes('Microsoft')) {
                    handleMicrosoftSignup();
                } else if (buttonText.includes('Apple')) {
                    handleAppleSignup();
                }
            });
        }
    });

    // Social signup functions
    function handleGoogleSignup() {
        console.log('Google signup initiated');
        // Implement Google OAuth here
        alert('Google signup would be implemented here');
    }

    function handleMicrosoftSignup() {
        console.log('Microsoft signup initiated');
        // Implement Microsoft OAuth here
        alert('Microsoft signup would be implemented here');
    }

    function handleAppleSignup() {
        console.log('Apple signup initiated');
        // Implement Apple Sign In here
        alert('Apple signup would be implemented here');
    }

    // Clear errors when user starts typing
    const inputs = [fullnameInput, emailInput, passwordInput, confirmPasswordInput, phoneFullnameInput, phoneInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                const errorElement = document.getElementById(input.id.replace('-input', '-error'));
                if (errorElement && !errorElement.classList.contains('hidden')) {
                    hideError(errorElement, input);
                }
            });
        }
    });

    // Handle Enter key press
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createAccountBtn.click();
        }
    });

    confirmPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            createAccountBtn.click();
        }
    });

    phoneInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            requestSignupOtpBtn.click();
        }
    });
});

