document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const togglePasswordIcon = togglePasswordBtn.querySelector('i');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordIcon.setAttribute('data-lucide', 'eye');
        } else {
            passwordInput.type = 'password';
            togglePasswordIcon.setAttribute('data-lucide', 'eye-off');
        }
        lucide.createIcons();
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Submit the form
        form.submit();
    });

    // Social login buttons (for demonstration)
    document.querySelectorAll('.social-buttons button').forEach(button => {
        button.addEventListener('click', function() {
            alert('Social login will be implemented in the future.');
        });
    });

    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality will be implemented in the future.');
    });

    // Sign up link
    document.querySelector('.signup-link a').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Sign up page will be implemented in the future.');
    });
});
