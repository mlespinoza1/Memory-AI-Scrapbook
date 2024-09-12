document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const firstNameInput = document.getElementById('firstName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const togglePasswordIcon = togglePasswordBtn.querySelector('i');
    const termsContent = document.getElementById('termsContent');
    const acceptTermsCheckbox = document.getElementById('acceptTerms');
    const createNestBtn = document.getElementById('createNestBtn');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordIcon.classList.remove('fa-eye-slash');
            togglePasswordIcon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            togglePasswordIcon.classList.remove('fa-eye');
            togglePasswordIcon.classList.add('fa-eye-slash');
        }
    });

    // Enable "Accept Terms" checkbox when scrolled to bottom
    termsContent.addEventListener('scroll', function() {
        if (termsContent.scrollHeight - termsContent.scrollTop === termsContent.clientHeight) {
            acceptTermsCheckbox.disabled = false;
        }
    });

    // Enable/disable "Create Nest" button based on checkbox
    acceptTermsCheckbox.addEventListener('change', function() {
        createNestBtn.disabled = !this.checked;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            this.submit();
        }
    });

    function validateForm() {
        let isValid = true;

        if (firstNameInput.value.trim() === '') {
            isValid = false;
            showError(firstNameInput, 'First Name is required');
        } else {
            clearError(firstNameInput);
        }

        if (emailInput.value.trim() === '') {
            isValid = false;
            showError(emailInput, 'Email is required');
        } else if (!isValidEmail(emailInput.value.trim())) {
            isValid = false;
            showError(emailInput, 'Please enter a valid email address');
        } else {
            clearError(emailInput);
        }

        if (passwordInput.value.trim() === '') {
            isValid = false;
            showError(passwordInput, 'Password is required');
        } else if (passwordInput.value.length < 8) {
            isValid = false;
            showError(passwordInput, 'Password must be at least 8 characters long');
        } else {
            clearError(passwordInput);
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.input-group');
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        formGroup.classList.add('has-error');
    }

    function clearError(input) {
        const formGroup = input.closest('.input-group');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            formGroup.removeChild(error);
        }
        formGroup.classList.remove('has-error');
    }
});
