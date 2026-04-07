// Form Validation Functions for Run A Ride Authentication

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation function (minimum 6 characters)
function validatePassword(password) {
  return password.length >= 6;
}

// Phone number validation function (10 digits)
function validatePhone(phone) {
  const phoneRegex = /^\d{10}$/;
  // Remove any non-digit characters and check if it's exactly 10 digits
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(cleanPhone);
}

// Name validation function (minimum 2 characters)
function validateName(name) {
  return name.length >= 2 && name.trim() !== '';
}

// Show error message
function showErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Add error styling to the input field
    const inputField = errorElement.previousElementSibling?.querySelector('input');
    if (inputField) {
      inputField.classList.add('input-error');
      inputField.style.borderColor = '#ff4d4d';
    }
  }
}

// Clear specific error message
function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    
    // Remove error styling from the input field
    const inputField = errorElement.previousElementSibling?.querySelector('input');
    if (inputField) {
      inputField.classList.remove('input-error');
      inputField.style.borderColor = '';
    }
  }
}

// Clear all error messages
function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
    element.style.display = 'none';
    
    // Remove error styling from associated input fields
    const inputField = element.previousElementSibling?.querySelector('input');
    if (inputField) {
      inputField.classList.remove('input-error');
      inputField.style.borderColor = '';
    }
  });
}

// Password visibility toggle function
function setupPasswordToggle() {
  // Toggle for main password field
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
  
  // Toggle for confirm password field
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', function() {
      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }
}

// Format phone number input (optional enhancement)
function formatPhoneNumber(input) {
  // Remove all non-digit characters
  let phoneNumber = input.value.replace(/\D/g, '');
  
  // Limit to 10 digits
  if (phoneNumber.length > 10) {
    phoneNumber = phoneNumber.substring(0, 10);
  }
  
  // Update the input value
  input.value = phoneNumber;
}

// Real-time phone number formatting
function setupPhoneFormatting() {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
    
    phoneInput.addEventListener('keypress', function(e) {
      // Allow only numbers
      if (e.which < 48 || e.which > 57) {
        e.preventDefault();
      }
    });
  }
}

// Form submission with loading state
function setFormLoading(form, isLoading) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (isLoading) {
    submitButton.classList.add('btn-loading');
    submitButton.disabled = true;
    submitButton.textContent = '';
  } else {
    submitButton.classList.remove('btn-loading');
    submitButton.disabled = false;
    submitButton.textContent = submitButton.dataset.originalText || 'Submit';
  }
}

// Initialize all validation features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Setup password toggle functionality
  setupPasswordToggle();
  
  // Setup phone number formatting
  setupPhoneFormatting();
  
  // Store original button text
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(button => {
    button.dataset.originalText = button.textContent;
  });
  
  // Add input validation listeners
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    // Clear error when user starts typing
    input.addEventListener('input', function() {
      const errorElement = this.closest('.form-group').querySelector('.error-message');
      if (errorElement && errorElement.textContent) {
        clearError(errorElement.id);
      }
    });
    
    // Add focus styling
    input.addEventListener('focus', function() {
      this.parentElement.style.borderColor = '#ffb703';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.borderColor = '';
    });
  });
});

// Utility function to get form data
function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
}

// Utility function to validate entire form
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      const errorElement = input.closest('.form-group').querySelector('.error-message');
      if (errorElement) {
        showErrorMessage(errorElement.id, 'This field is required');
        isValid = false;
      }
    }
  });
  
  return isValid;
}

// Show success message
function showSuccessMessage(message) {
  // Remove any existing messages
  const existingSuccess = document.querySelector('.success-message');
  if (existingSuccess) existingSuccess.remove();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

// Add CSS animations for success message
if (!document.getElementById('success-animations')) {
  const style = document.createElement('style');
  style.id = 'success-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,
    validateName,
    showErrorMessage,
    clearError,
    clearErrors,
    showSuccessMessage
  };
}