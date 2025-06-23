document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservationForm")
    const submitBtn = document.getElementById("submitBtn")
    const buttonText = submitBtn.querySelector(".button-text")
    const loadingSpinner = submitBtn.querySelector(".loading-spinner")
    const successMessage = document.getElementById("successMessage")
  
    // Set minimum date to today
    const dateInput = document.getElementById("date")
    const today = new Date().toISOString().split("T")[0]
    dateInput.setAttribute("min", today)
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      // Get form data
      const formData = new FormData(form)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        date: formData.get("date"),
        time: formData.get("time"),
        guests: formData.get("guests"),
      }
  
      // Show loading state
      setLoadingState(true)
  
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
  
        // Show success message
        showSuccessMessage(data)
  
        // Reset form after 5 seconds
        setTimeout(() => {
          hideSuccessMessage()
          form.reset()
        }, 5000)
      } catch (error) {
        console.error("Error submitting reservation:", error)
        alert("There was an error submitting your reservation. Please try again.")
      } finally {
        setLoadingState(false)
      }
    })
  
    function setLoadingState(isLoading) {
      if (isLoading) {
        submitBtn.disabled = true
        buttonText.style.display = "none"
        loadingSpinner.style.display = "flex"
      } else {
        submitBtn.disabled = false
        buttonText.style.display = "block"
        loadingSpinner.style.display = "none"
      }
    }
  
    function showSuccessMessage(data) {
      // Hide form
      form.style.display = "none"
  
      // Populate success message
      document.getElementById("confirmName").textContent = data.name
      document.getElementById("confirmGuests").textContent = data.guests
      document.getElementById("confirmDate").textContent = formatDate(data.date)
      document.getElementById("confirmTime").textContent = formatTime(data.time)
      document.getElementById("confirmEmail").textContent = data.email
  
      // Show success message
      successMessage.style.display = "block"
    }
  
    function hideSuccessMessage() {
      successMessage.style.display = "none"
      form.style.display = "block"
    }
  
    function formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  
    function formatTime(timeString) {
      const [hours, minutes] = timeString.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    }
  
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav.navigation .nav-link').forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("href").split("#")[1]
        const targetElement = document.getElementById(targetId)
  
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })
  
    // Add form validation feedback
    const inputs = form.querySelectorAll("input[required]")
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value.trim() === "") {
          this.style.borderColor = "#ef4444"
        } else {
          this.style.borderColor = "rgba(255, 255, 255, 0.2)"
        }
      })
  
      input.addEventListener("input", function () {
        if (this.style.borderColor === "rgb(239, 68, 68)") {
          this.style.borderColor = "rgba(255, 255, 255, 0.2)"
        }
      })
    })
  
    // Handle navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (href.startsWith("index.html#")) {
              e.preventDefault();
              const hash = href.split('#')[1];
              window.location.href = `index.html#${hash}`;
          }
      });
    });
  })
