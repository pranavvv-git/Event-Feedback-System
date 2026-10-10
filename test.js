const db = require('./database');
const assert = require('assert');

async function runTests() {
  console.log("Starting backend database validation tests...");
  
  try {
    // 1. Initialize DB
    await db.init();
    console.log("✓ Database initialized successfully.");
    
    // 2. Fetch Events
    const events = await db.getEvents();
    console.log(`✓ Fetched ${events.length} seed events.`);
    assert(events.length > 0, "Database should have seeded events.");
    
    const targetEvent = events[0];
    console.log(`  First event: "${targetEvent.title}" (ID: ${targetEvent.id})`);
    
    // 3. Save Feedback
    const testFeedback = {
      name: "Test Runner",
      email: "test@example.com",
      event_id: targetEvent.id,
      rating: 5,
      comments: "Excellent cohort, very informative!"
    };
    
    const saved = await db.saveFeedback(testFeedback);
    console.log("✓ Saved feedback entry successfully.");
    assert.strictEqual(saved.name, testFeedback.name);
    assert.strictEqual(saved.email, testFeedback.email);
    assert.strictEqual(saved.rating, testFeedback.rating);
    assert.strictEqual(saved.comments, testFeedback.comments);
    
    // 4. Fetch Feedback List and verify entry exists
    const feedbacks = await db.getFeedback();
    console.log(`✓ Retrieved ${feedbacks.length} total feedback entries.`);
    
    const matched = feedbacks.find(f => f.id === saved.id);
    assert(matched, "Retrieved feedback list should contain the newly saved entry.");
    assert.strictEqual(matched.event_title, targetEvent.title, "Feedback should be correctly joined with event title.");
    console.log(`  Joined event title check: "${matched.event_title}"`);
    
    console.log("\n=========================================");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY! ✓");
    console.log("=========================================");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
    process.exit(1);
  }
}

runTests();
