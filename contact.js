/**
 * CONTACT.JS
 * Menangani form kontak dan validasi
 */

// ===== FORM SUBMISSION HANDLER =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate form
    if (!validateForm(name, email, subject, message)) {
        return;
    }
    
    // Show success message
    showSuccessMessage(name, email);
    
    // Reset form
    contactForm.reset();
    
    // In production, you would send data to server here
    // sendToServer({ name, email, subject, message });
}

// ===== FORM VALIDATION =====
function validateForm(name, email, subject, message) {
    // Check if all fields are filled
    if (!name || !email || !subject || !message) {
        showErrorMessage('Mohon isi semua field yang tersedia.');
        return false;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showErrorMessage('Format email tidak valid. Mohon periksa kembali.');
        return false;
    }
    
    // Validate message length
    if (message.length < 10) {
        showErrorMessage('Pesan terlalu pendek. Minimal 10 karakter.');
        return false;
    }
    
    return true;
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== SHOW SUCCESS MESSAGE =====
function showSuccessMessage(name, email) {
    const message = `Terima kasih, ${name}!\n\nPesan Anda telah diterima.\nKami akan segera menghubungi Anda melalui ${email}.`;
    alert(message);
    
    // You can replace alert with a custom modal/toast notification
}

// ===== SHOW ERROR MESSAGE =====
function showErrorMessage(message) {
    alert(message);
    
    // You can replace alert with a custom modal/toast notification
}

// ===== REAL-TIME VALIDATION (Optional) =====
function addRealTimeValidation() {
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#E5E5E5';
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            const charCount = this.value.length;
            if (charCount > 0 && charCount < 10) {
                this.style.borderColor = '#ffc107';
            } else if (charCount >= 10) {
                this.style.borderColor = '#28a745';
            } else {
                this.style.borderColor = '#E5E5E5';
            }
        });
    }
}
addRealTimeValidation();
