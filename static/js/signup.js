document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
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
        // Client-side validation can be added here if needed
        console.log('Sign-up form submitted');
    });
});
