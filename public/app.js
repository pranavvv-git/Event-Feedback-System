// Shared Configuration
const API_URL = '';

// Helper to escape HTML characters (prevents XSS vulnerabilities)
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format Iso Date to readable string
function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}

// Generate star characters based on rating integer
function getStarCharacters(rating) {
  const fullStars = '★'.repeat(rating);
  const emptyStars = '☆'.repeat(5 - rating);
  return `<span class="fb-stars">${fullStars}${emptyStars}</span>`;
}

// ==========================================
// 1. Events Page Loader (events.html)
// ==========================================
async function loadEventsPage() {
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;

  try {
    const response = await fetch(`${API_URL}/api/events`);
    if (!response.ok) throw new Error('Could not fetch events');
    const events = await response.json();

    if (events.length === 0) {
      eventsGrid.innerHTML = `
        <div class="card" style="grid-column: 1/-1; text-align: center; padding: 48px;">
          <h3 class="card-title">No Events Available</h3>
          <p class="card-body">We don't have any cohorts scheduled at this time. Please check back later!</p>
        </div>
      `;
      return;
    }

    eventsGrid.innerHTML = events.map(ev => {
      // Map category class name
      const categoryClass = ev.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      return `
        <div class="card">
          <span class="card-tag ${categoryClass}">${escapeHTML(ev.category)}</span>
          <h3 class="card-title">${escapeHTML(ev.title)}</h3>
          <p class="card-body">${escapeHTML(ev.description)}</p>
          <div class="card-meta">
            <div class="meta-item">
              <span class="meta-icon">&#128197;</span>
              <span>${escapeHTML(ev.date)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">&#128205;</span>
              <span>${escapeHTML(ev.location)}</span>
            </div>
          </div>
          <a href="feedback.html?event_id=${ev.id}" class="btn btn-primary" style="margin-top: 24px; text-align: center;">
            Submit Feedback
          </a>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Error fetching events:', error);
    eventsGrid.innerHTML = `
      <div class="card" style="grid-column: 1/-1; text-align: center; border-color: var(--error); padding: 48px;">
        <h3 class="card-title" style="color: var(--error);">Error Loading Events</h3>
        <p class="card-body">Could not connect to the backend server. Please verify the server is running.</p>
        <button onclick="loadEventsPage()" class="btn btn-secondary" style="margin-top: 16px;">Try Again</button>
      </div>
    `;
  }
}

// ==========================================
// 2. Feedback Form Logic (feedback.html)
// ==========================================
async function initFeedbackForm() {
  const form = document.getElementById('feedback-form');
  const eventSelect = document.getElementById('event_id');
  const errorBanner = document.getElementById('error-banner');
  const errorMessage = document.getElementById('error-message');
  const feedbackCard = document.getElementById('feedback-card');

  if (!form || !eventSelect) return;

  // Clear states
  errorBanner.style.display = 'none';

  // Fetch events to populate dropdown selection
  try {
    const response = await fetch(`${API_URL}/api/events`);
    if (!response.ok) throw new Error('Could not fetch events');
    const events = await response.json();

    events.forEach(ev => {
      const option = document.createElement('option');
      option.value = ev.id;
      option.textContent = `${ev.title} (${ev.category})`;
      eventSelect.appendChild(option);
    });

    // Check URL parameters for event_id auto-selection (Level 4: Task 1 integration)
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdParam = urlParams.get('event_id');
    if (eventIdParam) {
      eventSelect.value = eventIdParam;
    }

  } catch (error) {
    console.error('Failed to load events for form dropdown:', error);
    errorMessage.textContent = 'Failed to load events. Backend server may be offline.';
    errorBanner.style.display = 'flex';
  }

  // Handle Frontend Form Validation & Submit (Level 4: Task 4)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset error text displays
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    errorBanner.style.display = 'none';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const eventId = eventSelect.value;
    const ratingEl = document.querySelector('input[name="rating"]:checked');
    const comments = document.getElementById('comments').value.trim();

    let isValid = true;

    // 1. Name validation
    if (!name) {
      document.getElementById('name-error').style.display = 'block';
      isValid = false;
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      document.getElementById('email-error').style.display = 'block';
      isValid = false;
    }

    // 3. Event selection validation
    if (!eventId) {
      document.getElementById('event-error').style.display = 'block';
      isValid = false;
    }

    // 4. Rating validation
    if (!ratingEl) {
      document.getElementById('rating-error').style.display = 'block';
      isValid = false;
    }

    if (!isValid) return;

    // Send data to Backend API (Level 4: Task 1 & Task 2)
    try {
      const payload = {
        name,
        email,
        event_id: parseInt(eventId, 10),
        rating: parseInt(ratingEl.value, 10),
        comments
      };

      const submitResponse = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await submitResponse.json();

      if (!submitResponse.ok) {
        throw new Error(result.error || 'Feedback submission failed');
      }

      // Success callback - Show success UI panel (Level 4: Task 2)
      feedbackCard.innerHTML = `
        <div class="success-screen">
          <div class="success-icon">&#10004;</div>
          <h3 class="success-title">Feedback Submitted!</h3>
          <p class="success-text">Thank you for sharing your experience, ${escapeHTML(name)}. Your thoughts help us shape a better learning environment.</p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <a href="admin.html" class="btn btn-primary">Go to Dashboard</a>
            <a href="events.html" class="btn btn-secondary">Explore Events</a>
          </div>
        </div>
      `;

    } catch (err) {
      console.error('Submission failed:', err);
      errorMessage.textContent = err.message || 'Error occurred while saving feedback. Please try again.';
      errorBanner.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ==========================================
// 3. Feedback Dashboard Analytics (admin.html)
// ==========================================
async function loadDashboard() {
  const loadingState = document.getElementById('feedback-loading');
  const listContainer = document.getElementById('feedback-list');
  const emptyState = document.getElementById('feedback-empty');

  const totalCard = document.getElementById('total-responses');
  const averageCard = document.getElementById('average-rating');
  const positiveCard = document.getElementById('positive-percent');

  if (!listContainer) return;

  try {
    const response = await fetch(`${API_URL}/api/feedback`);
    if (!response.ok) throw new Error('Could not retrieve feedback');
    const feedbacks = await response.json();

    loadingState.style.display = 'none';

    if (feedbacks.length === 0) {
      emptyState.style.display = 'block';
      listContainer.style.display = 'none';
      
      // Zero out analytics cards
      totalCard.textContent = '0';
      averageCard.textContent = '0.0';
      positiveCard.textContent = '0%';
      return;
    }

    // Calculate Dashboard Analytics (Level 5 Task 3 Verification)
    const total = feedbacks.length;
    const ratingSum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = (ratingSum / total).toFixed(1);
    
    const positiveCount = feedbacks.filter(fb => fb.rating >= 4).length;
    const positivePct = Math.round((positiveCount / total) * 100);

    // Update Analytics UI Numbers
    totalCard.textContent = total;
    averageCard.textContent = avgRating;
    positiveCard.textContent = `${positivePct}%`;

    // Render list of reviews
    listContainer.innerHTML = feedbacks.map(fb => {
      const displayComment = fb.comments ? escapeHTML(fb.comments) : '<em style="color: var(--text-muted);">No comments provided.</em>';
      return `
        <div class="feedback-row">
          <div>
            <div class="fb-user">
              ${escapeHTML(fb.name)}
              <span class="fb-email">&lt;${escapeHTML(fb.email)}&gt;</span>
            </div>
            ${getStarCharacters(fb.rating)}
            <div class="fb-comment">${displayComment}</div>
          </div>
          <div class="fb-event-info">
            <div class="fb-event-name">${escapeHTML(fb.event_title)}</div>
            <div class="fb-date">${formatDate(fb.created_at)}</div>
          </div>
        </div>
      `;
    }).join('');

    listContainer.style.display = 'block';
    emptyState.style.display = 'none';

  } catch (error) {
    console.error('Failed to load Dashboard data:', error);
    loadingState.style.display = 'none';
    emptyState.style.display = 'none';
    
    const container = document.getElementById('feedback-list-container');
    container.innerHTML = `
      <div class="empty-state" style="color: var(--error);">
        <div class="empty-icon">&#9888;</div>
        <p>Failed to load dashboard data from the database server. Ensure server is online.</p>
        <button onclick="loadDashboard()" class="btn btn-secondary" style="margin-top: 16px;">Refresh Dashboard</button>
      </div>
    `;
  }
}
