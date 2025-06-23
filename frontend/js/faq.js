// Global variables
let allFaqItems = []
let currentCategory = "all"

// DOM Elements
const faqCard = document.querySelector(".faq-card")
const searchInput = document.getElementById("searchInput")
const categoryButtons = document.querySelectorAll(".category-btn")
const faqItems = document.querySelectorAll(".faq-item")
const faqQuestions = document.querySelectorAll(".faq-question")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("🍽️ Gastronome FAQ System Initialized")

  // Store all FAQ items for filtering
  allFaqItems = Array.from(faqItems)

  // Add entrance animation to the FAQ card
  setTimeout(() => {
    faqCard.classList.add("loaded")
  }, 300)

  // Setup event listeners
  setupEventListeners()

  // Initialize FAQ functionality
  initializeFAQ()
})

// Setup all event listeners
function setupEventListeners() {
  // FAQ question clicks
  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      toggleFAQItem(this.closest(".faq-item"))
    })
  })

  // Category filter buttons
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category")
      filterByCategory(category)
      updateActiveCategory(this)
    })
  })

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    filterBySearch(searchTerm)
  })

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu)
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close all open FAQ items
      faqItems.forEach((item) => {
        item.classList.remove("active")
      })
    }
  })
}

// Initialize FAQ functionality
function initializeFAQ() {
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add animation delays to FAQ items
  faqItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
  })
}

// Toggle FAQ item open/closed
function toggleFAQItem(item) {
  const isActive = item.classList.contains("active")

  // Close all other items (accordion behavior)
  faqItems.forEach((faqItem) => {
    if (faqItem !== item) {
      faqItem.classList.remove("active")
    }
  })

  // Toggle current item
  if (isActive) {
    item.classList.remove("active")
  } else {
    item.classList.add("active")

    // Scroll item into view if needed
    setTimeout(() => {
      const rect = item.getBoundingClientRect()
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

      if (!isVisible) {
        item.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }, 300)
  }

  // Add ripple effect
  addRippleEffect(item.querySelector(".faq-question"))
}

// Add ripple effect to clicked elements
function addRippleEffect(element) {
  const ripple = document.createElement("div")
  ripple.className = "ripple"

  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)

  ripple.style.width = ripple.style.height = size + "px"
  ripple.style.left = event.clientX - rect.left - size / 2 + "px"
  ripple.style.top = event.clientY - rect.top - size / 2 + "px"

  element.style.position = "relative"
  element.style.overflow = "hidden"
  element.appendChild(ripple)

  // Add ripple CSS if not already added
  if (!document.querySelector("#ripple-styles")) {
    const style = document.createElement("style")
    style.id = "ripple-styles"
    style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(212, 175, 55, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `
    document.head.appendChild(style)
  }

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// Filter FAQ items by category
function filterByCategory(category) {
  currentCategory = category

  faqItems.forEach((item) => {
    const itemCategory = item.getAttribute("data-category")

    if (category === "all" || itemCategory === category) {
      item.classList.remove("hidden")
      // Add stagger animation
      setTimeout(() => {
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, Math.random() * 200)
    } else {
      item.classList.add("hidden")
      item.style.opacity = "0"
      item.style.transform = "translateY(20px)"
    }
  })

  // Clear search when changing categories
  searchInput.value = ""

  // Show notification
  const categoryName = category === "all" ? "All Questions" : category.charAt(0).toUpperCase() + category.slice(1)
  showNotification(`Showing ${categoryName}`, "info")
}

// Filter FAQ items by search term
function filterBySearch(searchTerm) {
  if (searchTerm === "") {
    // Show all items in current category
    filterByCategory(currentCategory)
    return
  }

  let visibleCount = 0

  faqItems.forEach((item) => {
    const question = item.querySelector(".question-text").textContent.toLowerCase()
    const answer = item.querySelector(".answer-content").textContent.toLowerCase()
    const itemCategory = item.getAttribute("data-category")

    const matchesSearch = question.includes(searchTerm) || answer.includes(searchTerm)
    const matchesCategory = currentCategory === "all" || itemCategory === currentCategory

    if (matchesSearch && matchesCategory) {
      item.classList.remove("hidden")
      visibleCount++

      // Highlight search terms
      highlightSearchTerm(item, searchTerm)
    } else {
      item.classList.add("hidden")
    }
  })

  // Show search results notification
  if (searchTerm.length > 2) {
    showNotification(`Found ${visibleCount} result${visibleCount !== 1 ? "s" : ""} for "${searchTerm}"`, "info")
  }
}

// Highlight search terms in FAQ items
function highlightSearchTerm(item, searchTerm) {
  const questionElement = item.querySelector(".question-text")
  const answerElement = item.querySelector(".answer-content p")

  // Remove existing highlights
  ;[questionElement, answerElement].forEach((element) => {
    if (element) {
      element.innerHTML = element.textContent
    }
  })

  if (searchTerm.length < 3) return // Add highlights
  ;[questionElement, answerElement].forEach((element) => {
    if (element) {
      const regex = new RegExp(`(${searchTerm})`, "gi")
      element.innerHTML = element.textContent.replace(
        regex,
        '<mark style="background-color: var(--primary-gold); color: var(--dark-surface); padding: 2px 4px; border-radius: 3px;">$1</mark>',
      )
    }
  })
}

// Update active category button
function updateActiveCategory(activeButton) {
  categoryButtons.forEach((button) => {
    button.classList.remove("active")
  })
  activeButton.classList.add("active")
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navigation = document.querySelector(".navigation")
  const isVisible = navigation.style.display === "flex"

  navigation.style.display = isVisible ? "none" : "flex"

  if (!isVisible) {
    navigation.style.position = "absolute"
    navigation.style.top = "100%"
    navigation.style.left = "0"
    navigation.style.right = "0"
    navigation.style.backgroundColor = "var(--dark-surface)"
    navigation.style.flexDirection = "column"
    navigation.style.padding = "20px"
    navigation.style.borderTop = "1px solid rgba(212, 175, 55, 0.2)"
  }
}

// Show notification
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  // Set icon based on type
  let icon = "info-circle"
  if (type === "success") icon = "check-circle"
  if (type === "error") icon = "exclamation-circle"

  notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `

  // Add to document
  document.body.appendChild(notification)

  // Add CSS for notification if not already added
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
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
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
                max-width: 300px;
                backdrop-filter: blur(10px);
            }
            
            .notification.info {
                background-color: rgba(33, 150, 243, 0.9);
                color: white;
                border: 1px solid rgba(33, 150, 243, 0.3);
            }
            
            .notification.success {
                background-color: rgba(76, 175, 80, 0.9);
                color: white;
                border: 1px solid rgba(76, 175, 80, 0.3);
            }
            
            .notification.error {
                background-color: rgba(244, 67, 54, 0.9);
                color: white;
                border: 1px solid rgba(244, 67, 54, 0.3);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(100%); }
            }
        `
    document.head.appendChild(style)
  }

  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

// Add smooth scroll behavior for better UX
function addSmoothScrolling() {
  // Smooth scroll to top when clicking logo
  const logo = document.querySelector(".logo")
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

// Initialize smooth scrolling
addSmoothScrolling()

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + F to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault()
    searchInput.focus()
    searchInput.select()
  }

  // Escape to clear search
  if (e.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = ""
    filterByCategory(currentCategory)
    searchInput.blur()
  }
})

// Add loading animation
window.addEventListener("load", () => {
  // Add stagger animation to FAQ items
  faqItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease"

    setTimeout(() => {
      item.style.opacity = "1"
      item.style.transform = "translateY(0)"
    }, index * 100)
  })
})
