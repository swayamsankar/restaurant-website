 // Global variables
let orderItems = [];
let subtotal = 0;
let tax = 0;
let total = 0;

// DOM Elements
const orderForm = document.getElementById('orderForm');
const menuItems = document.querySelectorAll('.menu-item');
const orderItemsContainer = document.getElementById('orderItems');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const orderConfirmation = document.getElementById('orderConfirmation');
const confirmationDetails = document.getElementById('confirmationDetails');
const newOrderBtn = document.getElementById('newOrderBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍽️ Gastronome Order System Initialized');
    
    // Setup event listeners
    setupEventListeners();
    
    // Format phone input
    setupPhoneFormatting();
    
    // Add entrance animation to the order card
    const orderCard = document.querySelector('.order-card');
    setTimeout(() => {
        orderCard.style.opacity = '1';
        orderCard.style.transform = 'translateY(0)';
    }, 300);
});

// Setup all event listeners
function setupEventListeners() {
    // Add to order buttons
    document.querySelectorAll('.add-to-order').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            addToOrder(menuItem);
        });
    });
    
    // Form submission
    orderForm.addEventListener('submit', handleFormSubmission);
    
    // New order button
    newOrderBtn.addEventListener('click', resetOrder);
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Input focus animations
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Setup phone number formatting
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})/, '($1) ');
        }
        
        e.target.value = value;
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navigation = document.querySelector('.navigation');
    navigation.style.display = navigation.style.display === 'flex' ? 'none' : 'flex';
}

// Add item to order
function addToOrder(menuItem) {
    const itemId = menuItem.getAttribute('data-id');
    const itemName = menuItem.querySelector('h3').textContent;
    const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
    const itemImage = menuItem.querySelector('img').src;
    
    // Check if item already exists in order
    const existingItem = orderItems.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        orderItems.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: 1,
            image: itemImage
        });
        
        // Add selected class to menu item
        menuItem.classList.add('selected');
    }
    
    // Update order summary
    updateOrderSummary();
    
    // Show success notification
    showNotification(`${itemName} added to your order!`, 'success');
    
    // Animate the menu item
    animateMenuItemSelection(menuItem);
}

// Animate menu item selection
function animateMenuItemSelection(menuItem) {
    menuItem.style.transform = 'scale(0.95)';
    setTimeout(() => {
        menuItem.style.transform = '';
    }, 200);
}

// Update order summary
function updateOrderSummary() {
    // Clear order items container
    orderItemsContainer.innerHTML = '';
    
    // Check if order is empty
    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-order">Your order is empty. Please add items from the menu.</p>';
        subtotal = 0;
    } else {
        // Calculate subtotal and create order items
        subtotal = 0;
        
        orderItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItemElement = document.createElement('div');
            orderItemElement.className = 'order-item';
            orderItemElement.innerHTML = `
                <div class="order-item-details">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div>
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">₹${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="order-item-quantity">
                    <button type="button" class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button type="button" class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="order-item-price">₹${itemTotal.toFixed(2)}</div>
                <button type="button" class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            orderItemsContainer.appendChild(orderItemElement);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                decreaseQuantity(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                increaseQuantity(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                removeItem(this.getAttribute('data-id'));
            });
        });
    }
    
    // Calculate tax and total
    tax = subtotal * 0.08;
    total = subtotal + tax;
    
    // Update summary elements
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Animate total
    totalElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
    }, 300);
}

// Decrease item quantity
function decreaseQuantity(itemId) {
    const item = orderItems.find(item => item.id === itemId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateOrderSummary();
    } else if (item && item.quantity === 1) {
        removeItem(itemId);
    }
}

// Increase item quantity
function increaseQuantity(itemId) {
    const item = orderItems.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += 1;
        updateOrderSummary();
    }
}

// Remove item from order
function removeItem(itemId) {
    // Find the item index
    const itemIndex = orderItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const removedItem = orderItems[itemIndex];
        
        // Remove item from array
        orderItems.splice(itemIndex, 1);
        
        // Remove selected class from menu item
        const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (menuItem) {
            menuItem.classList.remove('selected');
        }
        
        // Update order summary
        updateOrderSummary();
        
        // Show notification
        showNotification(`${removedItem.name} removed from your order.`, 'info');
    }
}
// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate order
    if (orderItems.length === 0) {
        showNotification('Please add at least one item to your order.', 'error');
        return;
    }
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = document.getElementById('submitOrder');
    submitButton.innerHTML = `
        <span class="btn-content">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Processing...</span>
        </span>
    `;
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showOrderConfirmation();
    }, 2000);
}

// Validate form
function validateForm() {
    const requiredFields = ['name', 'phone', 'email', 'time', 'orderType'];
    
    // Check if delivery is selected and address is provided
    const orderType = document.getElementById('orderType').value;
    if (orderType === 'delivery') {
        requiredFields.push('address');
    }
    
    return requiredFields.every(fieldId => {
        const field = document.getElementById(fieldId);
        return field && field.value.trim() !== '';
    });
}

// Show order confirmation
function showOrderConfirmation() {
    // Get form data
    const formData = new FormData(orderForm);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address') || 'Pickup',
        time: formData.get('time'),
        orderType: formData.get('orderType'),
        instructions: formData.get('instructions') || 'None',
        items: orderItems,
        subtotal: subtotal,
        tax: tax,
        total: total
    };
    
    // Generate order number
    const orderNumber = 'GR' + Date.now().toString().slice(-6);
    
    // Format time
    const timeString = orderData.time;
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Create confirmation details HTML
    const detailsHTML = `
        <div class="confirmation-order-details">
            <div class="confirmation-row">
                <strong>Order Number:</strong>
                <span class="order-number">${orderNumber}</span>
            </div>
            <div class="confirmation-row">
                <strong>Name:</strong>
                <span>${orderData.name}</span>
            </div>
            <div class="confirmation-row">
                <strong>Phone:</strong>
                <span>${orderData.phone}</span>
            </div>
            <div class="confirmation-row">
                <strong>Email:</strong>
                <span>${orderData.email}</span>
            </div>
            <div class="confirmation-row">
                <strong>${orderData.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Location'}:</strong>
                <span>${orderData.orderType === 'delivery' ? orderData.address : 'Gastronome Restaurant'}</span>
            </div>
            <div class="confirmation-row">
                <strong>Time:</strong>
                <span>${formattedTime}</span>
            </div>
            ${orderData.instructions !== 'None' ? `
            <div class="confirmation-row">
                <strong>Special Instructions:</strong>
                <span>${orderData.instructions}</span>
            </div>
            ` : ''}
        </div>
        
        <h3 class="confirmation-section-title">Order Items</h3>
        <div class="confirmation-items">
            ${orderData.items.map(item => `
                <div class="confirmation-item">
                    <div class="confirmation-item-details">
                        <span class="confirmation-item-name">${item.name}</span>
                        <span class="confirmation-item-quantity">x${item.quantity}</span>
                    </div>
                    <span class="confirmation-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="confirmation-total">
            <div class="confirmation-total-row">
                <span>Subtotal:</span>
                <span>₹${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div class="confirmation-total-row">
                <span>Tax (8%):</span>
                <span>₹${orderData.tax.toFixed(2)}</span>
            </div>
            <div class="confirmation-total-row confirmation-final-total">
                <span>Total:</span>
                <span>₹${orderData.total.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="confirmation-message">
            <i class="fas fa-info-circle"></i>
            <p>${orderData.orderType === 'delivery' ? 'Your order will be delivered within 45-60 minutes.' : 'Your order will be ready for pickup in 30-45 minutes.'}</p>
        </div>
    `;
    
    // Update confirmation details
    confirmationDetails.innerHTML = detailsHTML;
    
    // Hide form and show confirmation
    orderForm.style.display = 'none';
    orderConfirmation.style.display = 'block';
    
    // Add CSS for confirmation details
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-order-details {
            margin-bottom: 30px;
        }
        
        .confirmation-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .order-number {
            color: var(--primary-gold);
            font-weight: 600;
            font-family: monospace;
            font-size: 18px;
        }
        
        .confirmation-section-title {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            margin: 20px 0 15px;
            color: var(--primary-gold);
        }
        
        .confirmation-items {
            margin-bottom: 20px;
        }
        
        .confirmation-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .confirmation-item-details {
            display: flex;
            gap: 10px;
        }
        
        .confirmation-item-quantity {
            color: var(--text-muted);
        }
        
        .confirmation-item-price {
            color: var(--primary-gold);
            font-weight: 500;
        }
        
        .confirmation-total {
            background-color: rgba(212, 175, 55, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .confirmation-total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        
        .confirmation-final-total {
            font-weight: 600;
            color: var(--primary-gold);
            font-size: 18px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .confirmation-message {
            display: flex;
            align-items: center;
            gap: 10px;
            background-color: rgba(76, 175, 80, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            color: var(--success-green);
        }
    `;
    document.head.appendChild(style);
    
    // Scroll to confirmation
    orderConfirmation.scrollIntoView({ behavior: 'smooth' });
}

// Reset order
function resetOrder() {
    // Clear order items
    orderItems = [];
    
    // Reset form
    orderForm.reset();
    
    // Update order summary
    updateOrderSummary();
    
    // Remove selected class from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Show form and hide confirmation
    orderForm.style.display = 'block';
    orderConfirmation.style.display = 'none';
    
    // Reset submit button
    const submitButton = document.getElementById('submitOrder');
    submitButton.innerHTML = `
        <span class="btn-content">
            <i class="fas fa-check-circle"></i>
            <span>Complete Order</span>
        </span>
    `;
    submitButton.disabled = false;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
            max-width: 300px;
        }
        
        .notification.info {
            background-color: #2196F3;
            color: white;
        }
        
        .notification.success {
            background-color: #4CAF50;
            color: white;
        }
        
        .notification.error {
            background-color: #F44336;
            color: white;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 3.5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3500);
}

// Add window load event
window.addEventListener('load', function() {
    // Add CSS for initial animation
    const style = document.createElement('style');
    style.textContent = `
        .order-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
    `;
    document.head.appendChild(style);
});
