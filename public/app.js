
/* ============================================
   Event Feedback System
   Frontend Application Logic
============================================ */

const API_URL = "";

/* ---------- Helper Functions ---------- */

function escapeHTML(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStarCharacters(rating) {
  const score = Math.max(
    0,
    Math.min(5, Math.round(Number(rating) || 0))
  );

  return `<span class="fb-stars" aria-label="${score} out of 5 stars">${"★".repeat(score)}${"☆".repeat(5 - score)}</span>`;
}

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

function showMessage(container, title, message) {
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="grid-column: 1 / -1; text-align: center;">
      <h3 class="card-title">${escapeHTML(title)}</h3>
      <p class="card-body">${escapeHTML(message)}</p>
    </div>
  `;
}

/* ---------- Events Page ---------- */

async function loadEventsPage() {
  const eventsGrid = document.getElementById("events-grid");
  if (!eventsGrid) return;

  try {
    const events = await fetchAPI("/api/events");

    if (!Array.isArray(events) || events.length === 0) {
      showMessage(
        eventsGrid,
        "No Events Available",
        "There are no events to display right now."
      );
      return;
    }

    eventsGrid.innerHTML = events.map((event) => {
      const category = event.category || "General";
      const categoryClass = category
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");

      return `
        <article class="card">
          <span class="card-tag ${escapeHTML(categoryClass)}">
            ${escapeHTML(category)}
          </span>

          <h3 class="card-title">
            ${escapeHTML(event.title || "Untitled Event")}
          </h3>

          <p class="card-body">
            ${escapeHTML(event.description || "No description available.")}
          </p>

          <div class="card-meta">
            <div class="meta-item">
              <span class="meta-icon" aria-hidden="true">&#128197;</span>
              <span>${escapeHTML(event.date || "Date to be announced")}</span>
            </div>

            <div class="meta-item">
              <span class="meta-icon" aria-hidden="true">&#128205;</span>
              <span>${escapeHTML(event.location || "Location to be announced")}</span>
            </div>
          </div>

          <a
            href="feedback.html?event_id=${encodeURIComponent(event.id)}"
            class="btn btn-primary"
            style="margin-top: 24px; text-align: center;"
          >
            Share Feedback
          </a>
        </article>
      `;
    }).join("");
  } catch (error) {
    console.error("Unable to load events:", error);

    showMessage(
      eventsGrid,
      "Unable to Load Events",
      "Please check that the server is running, then refresh the page."
    );
  }
}

/* ---------- Feedback Form ---------- */

async function initFeedbackForm() {
  const form = document.getElementById("feedback-form");
  const eventSelect = document.getElementById("event_id");
  const errorBanner = document.getElementById("error-banner");
  const errorMessage = document.getElementById("error-message");
  const feedbackCard = document.getElementById("feedback-card");

  if (!form || !eventSelect) return;

  function showError(message) {
    if (errorMessage) errorMessage.textContent = message;
    if (errorBanner) errorBanner.style.display = "flex";
  }

  function hideError() {
    if (errorBanner) errorBanner.style.display = "none";
  }

  function setFieldError(fieldId, message) {
    const element = document.getElementById(fieldId);
    if (element) element.textContent = message;
  }

  hideError();

  try {
    const events = await fetchAPI("/api/events");

    eventSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose an event";
    placeholder.disabled = true;
    placeholder.selected = true;
    eventSelect.appendChild(placeholder);

    if (Array.isArray(events)) {
      events.forEach((event) => {
        const option = document.createElement("option");
        option.value = String(event.id);
        option.textContent =
          `${event.title || "Untitled Event"} (${event.category || "General"})`;
        eventSelect.appendChild(option);
      });
    }

    const params = new URLSearchParams(window.location.search);
    const selectedEventId = params.get("event_id");

    if (selectedEventId !== null) {
      const matchingOption = Array.from(eventSelect.options).find(
        (option) => option.value === selectedEventId
      );

      if (matchingOption) {
        eventSelect.value = selectedEventId;
      }
    }
  } catch (error) {
    console.error("Unable to load events for feedback:", error);
    showError("Could not load events. Please refresh the page and try again.");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideError();

    setFieldError("name-error", "");
    setFieldError("email-error", "");
    setFieldError("event-error", "");
    setFieldError("rating-error", "");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const commentsInput = document.getElementById("comments");

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const eventId = eventSelect.value;
    const comments = commentsInput?.value.trim() || "";

    const checkedRating = form.querySelector(
      'input[name="rating"]:checked'
    );

    const rating = checkedRating
      ? Number(checkedRating.value)
      : 0;

    let valid = true;

    if (!name) {
      setFieldError("name-error", "Please enter your name.");
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      setFieldError("email-error", "Please enter a valid email address.");
      valid = false;
    }

    if (!eventId) {
      setFieldError("event-error", "Please select an event.");
      valid = false;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setFieldError("rating-error", "Please select a rating from 1 to 5.");
      valid = false;
    }

    if (!valid) return;

    const submitButton = form.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await fetchAPI("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          event_id: eventId,
          rating,
          comments
        })
      });

      if (feedbackCard) {
        feedbackCard.innerHTML = `
          <div class="card" style="text-align: center;">
            <h2 class="card-title">Thank You for Your Feedback!</h2>
            <p class="card-body">
              Your response has been submitted successfully.
              We appreciate you taking the time to share your experience.
            </p>
            <a href="events.html" class="btn btn-primary">
              Explore More Events
            </a>
            <a href="index.html" class="btn btn-secondary">
              Back to Home
            </a>
          </div>
        `;
      } else {
        showError("Feedback submitted, but the confirmation section could not be displayed.");
      }
    } catch (error) {
      console.error("Feedback submission failed:", error);
      showError("Your feedback could not be submitted. Please check the server and try again.");
    } finally {
      if (submitButton && submitButton.isConnected) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Feedback";
      }
    }
  });
}

/* ---------- Admin Dashboard ---------- */

async function loadDashboard() {
  const totalResponses = document.getElementById("total-responses");
  const averageRating = document.getElementById("average-rating");
  const positivePercent = document.getElementById("positive-percent");
  const feedbackList = document.getElementById("feedback-list");
  const feedbackLoading = document.getElementById("feedback-loading");
  const feedbackEmpty = document.getElementById("feedback-empty");
  const feedbackListContainer = document.getElementById("feedback-list-container");

  if (
    !totalResponses &&
    !averageRating &&
    !positivePercent &&
    !feedbackList
  ) {
    return;
  }

  if (feedbackLoading) feedbackLoading.style.display = "block";
  if (feedbackEmpty) feedbackEmpty.style.display = "none";

  try {
    const feedback = await fetchAPI("/api/feedback");

    if (!Array.isArray(feedback)) {
      throw new Error("Unexpected feedback data received from server.");
    }

    const total = feedback.length;
    const ratingSum = feedback.reduce(
      (sum, item) => sum + (Number(item.rating) || 0),
      0
    );

    const average = total ? (ratingSum / total).toFixed(1) : "0.0";

    const positiveCount = feedback.filter(
      (item) => Number(item.rating) >= 4
    ).length;

    const positivePercentage = total
      ? Math.round((positiveCount / total) * 100)
      : 0;

    if (totalResponses) totalResponses.textContent = total;
    if (averageRating) averageRating.textContent = average;
    if (positivePercent) {
      positivePercent.textContent = `${positivePercentage}%`;
    }

    if (feedbackList) {
      if (total === 0) {
        feedbackList.innerHTML = "";
        if (feedbackEmpty) feedbackEmpty.style.display = "block";
      } else {
        feedbackList.innerHTML = feedback.map((item) => `
          <article class="feedback-item">
            <div class="feedback-item-header">
              <div>
                <h3>${escapeHTML(item.name || "Anonymous")}</h3>
                <p>${escapeHTML(item.email || "No email provided")}</p>
              </div>
              <div>${getStarCharacters(item.rating)}</div>
            </div>

            <p class="feedback-comment">
              ${escapeHTML(item.comments || "No comments provided.")}
            </p>

            <div class="feedback-item-footer">
              <span>${escapeHTML(item.event_title || "Event")}</span>
              <span>${escapeHTML(formatDate(item.created_at))}</span>
            </div>
          </article>
        `).join("");
      }
    }
  } catch (error) {
    console.error("Unable to load dashboard:", error);

    if (feedbackListContainer) {
      showMessage(
        feedbackListContainer,
        "Dashboard Unavailable",
        "Could not load feedback. Please check the server and refresh the page."
      );
    } else if (feedbackList) {
      showMessage(
        feedbackList,
        "Dashboard Unavailable",
        "Could not load feedback. Please check the server and refresh the page."
      );
    }
  } finally {
    if (feedbackLoading) feedbackLoading.style.display = "none";
  }
}
