// DOM Elements
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const navClose = document.getElementById("nav-close")
const navLinks = document.querySelectorAll(".nav-link")
const header = document.getElementById("header")
const scrollTopBtn = document.getElementById("scroll-top")
const contactForm = document.getElementById("contact-form")
const statNumbers = document.querySelectorAll(".stat-number")

// Mobile Navigation Toggle
function toggleMobileNav() {
  navMenu.classList.toggle("show")
  navToggle.classList.toggle("active")
  document.body.style.overflow = navMenu.classList.contains("show") ? "hidden" : ""
}

function closeMobileNav() {
  navMenu.classList.remove("show")
  navToggle.classList.remove("active")
  document.body.style.overflow = ""
}

// Event Listeners for Navigation
navToggle.addEventListener("click", toggleMobileNav)
navClose.addEventListener("click", closeMobileNav)

// Close mobile nav when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileNav()

    // Update active link
    navLinks.forEach((l) => l.classList.remove("active"))
    link.classList.add("active")
  })
})

// Close mobile nav when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    closeMobileNav()
  }
})

// Header Scroll Effect
function handleScroll() {
  const scrollY = window.scrollY

  // Header background on scroll
  if (scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }

  // Show/hide scroll to top button
  if (scrollY > 500) {
    scrollTopBtn.classList.add("show")
  } else {
    scrollTopBtn.classList.remove("show")
  }

  // Update active navigation link based on scroll position
  updateActiveNavLink()
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollY = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"))
      if (navLink) navLink.classList.add("active")
    }
  })
}

// Scroll to top functionality
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = header.offsetHeight
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + (target >= 1000 ? "+" : "")
  }, 16)
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")

      // Animate counters when stats section is visible
      if (entry.target.classList.contains("hero-stats")) {
        statNumbers.forEach((stat) => {
          const target = Number.parseInt(stat.getAttribute("data-target"))
          animateCounter(stat, target)
        })
      }
    }
  })
}, observerOptions)

// Observe elements for animation
function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".about-card, .timeline-item, .initiative-card, .job-card, .hero-stats",
  )

  animatedElements.forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.transitionDelay = `${index * 0.1}s`
    observer.observe(el)
  })
}

// Contact Form Handling
function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const submitBtn = contactForm.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  // Show loading state
  submitBtn.innerHTML = '<span class="loading"></span> Processing Reservation...'
  submitBtn.disabled = true

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    // Reset form
    contactForm.reset()

    // Show success message
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Reservation Confirmed!'
    submitBtn.style.background = "var(--accent-color)"

    // Reset button after 3 seconds
    setTimeout(() => {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
      submitBtn.style.background = ""
    }, 3000)

    // Show success notification
    showNotification("Reservation confirmed! We'll contact you shortly to finalize details.", "success")
  }, 2000)
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "var(--accent-color)" : "var(--primary-color)"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.2s ease;
    `

  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Job Application Handling
function handleJobApplication(e) {
  e.preventDefault()
  const button = e.target
  const originalText = button.textContent

  button.textContent = "Submitting Application..."
  button.style.pointerEvents = "none"

  setTimeout(() => {
    button.textContent = "Application Submitted!"
    button.style.background = "var(--accent-color)"

    showNotification("Application submitted successfully! We'll review it and get back to you soon.", "success")

    setTimeout(() => {
      button.textContent = originalText
      button.style.background = ""
      button.style.pointerEvents = ""
    }, 3000)
  }, 1500)
}

// Parallax Effect for Hero Section
function handleParallax() {
  const scrolled = window.pageYOffset
  const heroImage = document.querySelector(".hero-bg-shape")

  if (heroImage) {
    const rate = scrolled * -0.5
    heroImage.style.transform = `translateY(${rate}px)`
  }
}

// Lazy Loading for Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[src*="placeholder"]')

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.style.opacity = "0"
        img.style.transition = "opacity 0.3s ease"

        setTimeout(() => {
          img.style.opacity = "1"
        }, 100)

        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Set minimum date for reservation form
function setMinDate() {
  const dateInput = document.getElementById("date")
  if (dateInput) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    dateInput.min = tomorrow.toISOString().split("T")[0]
  }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
  if (e.key === "Escape" && navMenu.classList.contains("show")) {
    closeMobileNav()
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initAnimations()

  // Initialize lazy loading
  initLazyLoading()

  // Set minimum date for reservations
  setMinDate()

  // Add event listeners
  window.addEventListener("scroll", handleScroll)
  window.addEventListener("scroll", handleParallax)
  document.addEventListener("keydown", handleKeyboardNavigation)

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Add job application handlers
  document.querySelectorAll(".job-apply-btn").forEach((btn) => {
    btn.addEventListener("click", handleJobApplication)
  })

  // Initial scroll handler call
  handleScroll()

  // Add resize handler for mobile nav
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu.classList.contains("show")) {
      closeMobileNav()
    }
  })
})

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Apply throttling to scroll handlers
window.addEventListener("scroll", throttle(handleScroll, 16))
window.addEventListener("scroll", throttle(handleParallax, 16))

// Preload critical resources
function preloadResources() {
  const criticalImages = ["/placeholder.svg?height=500&width=600", "/placeholder.svg?height=400&width=500"]

  criticalImages.forEach((src) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  })
}

// Initialize preloading
preloadResources()

// Restaurant-specific functionality
function initRestaurantFeatures() {
  // Add special dietary requirement suggestions
  const messageTextarea = document.getElementById("message")
  if (messageTextarea) {
    messageTextarea.addEventListener("focus", () => {
      if (!messageTextarea.value) {
        messageTextarea.placeholder =
          "Special requests, dietary restrictions (vegetarian, vegan, gluten-free, allergies), celebration details, seating preferences..."
      }
    })
  }

  // Add guest number validation
  const guestsInput = document.getElementById("guests")
  if (guestsInput) {
    guestsInput.addEventListener("change", (e) => {
      const guests = Number.parseInt(e.target.value)
      if (guests > 8) {
        showNotification(
          "For parties larger than 8 guests, please call us directly at (555) 123-FOOD for special arrangements.",
          "info",
        )
      }
    })
  }
}

// Initialize restaurant-specific features
document.addEventListener("DOMContentLoaded", initRestaurantFeatures)
