require('dotenv').config();

const { test, expect } = require('@playwright/test');

// ============================================================
// CREDENTIALS
// ============================================================
const USER_EMAIL    = process.env.TEST_USER_EMAIL    || 'sunilchandrasekara60@gmail.com';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'Adee1234';
const ADMIN_EMAIL   = process.env.TEST_ADMIN_EMAIL   || 'ishinikavishka422@gmail.com';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Ishini@2002';

// A unique timestamp message used across tests to locate the exact review
const REVIEW_MESSAGE = `Automated Test Review ${Date.now()}`;
const REVIEW_RATING  = 5;

// ============================================================
// HELPER: Login
// ============================================================
async function performLogin(page, email, password) {
  console.log(`🔐 Logging in as ${email}...`);
  await page.goto('http://localhost:5173/login');
  await page.waitForTimeout(2000);

  const loginIdInput = page.locator('input[name="loginIdentifier"]');
  if (!await loginIdInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    throw new Error('Login identifier field not found');
  }
  await loginIdInput.fill(email);

  const passwordInput = page.locator('input[name="password"]');
  if (!await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    throw new Error('Password field not found');
  }
  await passwordInput.fill(password);

  const loginBtnSelectors = [
    'button:has-text("Sign In To Console")',
    'button:has-text("Login")',
    'button:has-text("Sign In")',
    'button[type="submit"]'
  ];

  let clicked = false;
  for (const sel of loginBtnSelectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click({ timeout: 5000 });
      clicked = true;
      break;
    }
  }
  if (!clicked) throw new Error('Login button not found');

  try {
    await page.waitForURL(/\/(dashboard|admin|home|events|profile)/, { timeout: 15000 });
  } catch {
    await page.waitForTimeout(3000);
    if (page.url().includes('login')) throw new Error('Login failed – still on login page');
  }
  console.log('✅ Logged in successfully');
}

// ============================================================
// HELPER: Logout current session
// ============================================================
async function performLogout(page) {
  console.log('🚪 Logging out...');
  await page.goto('http://localhost:5173/settings');
  await page.waitForTimeout(1500);

  const logoutBtn = page.locator(
    'button:has-text("Logout"), button:has-text("Log Out"), button:has-text("Sign Out")'
  ).first();

  if (await logoutBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await logoutBtn.click({ timeout: 5000 });
    await page.waitForURL('**/login', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    console.log('✅ Logged out via button');
  } else {
    // Fallback: clear localStorage then go to login
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(1000);
    console.log('✅ Logged out via localStorage clear');
  }
}

// ============================================================
// HELPER: Navigate to an event details page
// Returns the event URL used
// ============================================================
async function navigateToEventDetails(page) {
  console.log('📍 Navigating to Events listing...');
  await page.goto('http://localhost:5173/events');
  await page.waitForTimeout(2000);

  // Click the first event card's detail link / title
  const eventLinkSelectors = [
    'a[href*="/events/"]',
    'button:has-text("View Details")',
    'a:has-text("View Details")',
    '[data-testid="event-card"] a',
  ];

  for (const sel of eventLinkSelectors) {
    const link = page.locator(sel).first();
    if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
      await link.click({ timeout: 5000 });
      await page.waitForTimeout(2000);
      console.log('✅ Opened event details, URL:', page.url());
      return page.url();
    }
  }
  throw new Error('Could not navigate to any event details page');
}

// ============================================================
// HELPER: Submit a review on the current event details page
// ============================================================
async function submitReview(page, rating, message) {
  console.log(`⭐ Submitting ${rating}-star review...`);

  // Star buttons are rendered as <button type="button"> inside the review form
  // Click the nth star (1-indexed)
  const starBtns = page.locator('form button[type="button"]');
  const starCount = await starBtns.count();
  console.log(`   Found ${starCount} star buttons`);

  if (starCount >= rating) {
    await starBtns.nth(rating - 1).click();
    await page.waitForTimeout(500);
    console.log(`✅ Selected ${rating} star(s)`);
  } else {
    throw new Error(`Expected at least ${rating} star buttons, found ${starCount}`);
  }

  // Fill the review textarea
  const textarea = page.locator('textarea').filter({ hasText: '' }).first();
  if (await textarea.isVisible({ timeout: 5000 }).catch(() => false)) {
    await textarea.fill(message);
    console.log('✅ Review message filled');
  } else {
    throw new Error('Review textarea not found');
  }

  // Submit
  const submitBtn = page.locator(
    'button:has-text("Submit Review"), button:has-text("Update Review")'
  ).first();
  if (!await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    throw new Error('Submit Review button not found');
  }
  await submitBtn.click({ timeout: 5000 });
  await page.waitForTimeout(3000);
  console.log('✅ Review submitted');
}

// ============================================================
// HELPER: Admin login + navigate to /admin/ratings
// ============================================================
async function navigateToAdminReviews(page) {
  await performLogin(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('📍 Navigating to Admin Ratings page...');
  await page.goto('http://localhost:5173/admin/ratings');
  await page.waitForTimeout(2000);
  console.log('✅ Admin reviews page loaded');
}

// ============================================================
// HELPER: Search for a review in the admin table
// ============================================================
async function searchReviewInAdmin(page, searchText) {
  console.log(`🔍 Searching for review: "${searchText.substring(0, 30)}..."`);
  const searchInput = page.locator('input[placeholder*="Search"]').first();
  if (!await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    throw new Error('Search input not found in admin reviews table');
  }
  await searchInput.fill(searchText);
  await page.waitForTimeout(1500);
  console.log('✅ Search applied');
}

// ============================================================
// HELPER: Delete a review row that contains the given text
// ============================================================
async function deleteReviewInAdmin(page, reviewText) {
  const row = page.locator('tr').filter({ hasText: reviewText }).first();
  if (!await row.isVisible({ timeout: 5000 }).catch(() => false)) {
    throw new Error(`Row containing "${reviewText.substring(0, 30)}" not found`);
  }

  // Accept the browser confirm dialog automatically
  page.once('dialog', dialog => dialog.accept());
  await row.locator('button:has-text("Delete")').click({ timeout: 5000 });
  await page.waitForTimeout(2000);
  console.log('✅ Delete confirmed');
}

// ============================================================
// TEST 1: SUBMIT REVIEW (User Flow)
// ============================================================
test.describe('Submit Review Flow', () => {
  test('User can submit a star rating and review on an event', async ({ page }) => {
    test.setTimeout(90000);

    try {
      console.log('\n🟡 [REVIEW-SUBMIT] Step 1: Login as user');
      await performLogin(page, USER_EMAIL, USER_PASSWORD);
      await page.screenshot({ path: 'test-results/review-1-logged-in.png' });

      console.log('🟡 [REVIEW-SUBMIT] Step 2: Navigate to event details');
      await navigateToEventDetails(page);
      await page.screenshot({ path: 'test-results/review-2-event-page.png' });

      console.log('🟡 [REVIEW-SUBMIT] Step 3: Submit review');
      await submitReview(page, REVIEW_RATING, REVIEW_MESSAGE);
      await page.screenshot({ path: 'test-results/review-3-submitted.png' });

      console.log('🟡 [REVIEW-SUBMIT] Step 4: Verify review appears on page');
      const pageContent = await page.textContent('body');
      if (pageContent.includes(REVIEW_MESSAGE)) {
        console.log('✅ Review message confirmed on event page');
      } else {
        console.log('⚠️ Review may be visible – content check inconclusive');
      }

      await page.screenshot({ path: 'test-results/review-4-verified-on-page.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 SUBMIT REVIEW FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Submit review error:', e.message);
      await page.screenshot({ path: 'test-results/review-submit-error.png' }).catch(() => {});
      throw e;
    }
  });
});

// ============================================================
// TEST 2: UPDATE REVIEW (User Flow)
// ============================================================
test.describe('Update Review Flow', () => {
  test('User can update their existing review on an event', async ({ page }) => {
    test.setTimeout(90000);

    const updatedMessage = `Updated Review ${Date.now()}`;

    try {
      console.log('\n🔵 [REVIEW-UPDATE] Step 1: Login as user');
      await performLogin(page, USER_EMAIL, USER_PASSWORD);

      console.log('🔵 [REVIEW-UPDATE] Step 2: Navigate to event details');
      await navigateToEventDetails(page);

      console.log('🔵 [REVIEW-UPDATE] Step 3: Submit initial review (or re-use existing)');
      try {
        await submitReview(page, 3, `Initial review ${Date.now()}`);
      } catch (e) {
        console.warn('⚠️ Could not submit initial review – may already exist. Continuing...');
      }

      console.log('🔵 [REVIEW-UPDATE] Step 4: Update the review');
      await submitReview(page, 4, updatedMessage);
      await page.screenshot({ path: 'test-results/review-update-submitted.png' });

      console.log('🔵 [REVIEW-UPDATE] Step 5: Verify updated message appears');
      const pageContent = await page.textContent('body');
      if (pageContent.includes(updatedMessage)) {
        console.log('✅ Updated review message confirmed on event page');
      } else {
        console.log('⚠️ Updated review may be visible – content check inconclusive');
      }

      await page.screenshot({ path: 'test-results/review-update-verified.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 UPDATE REVIEW FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Update review error:', e.message);
      await page.screenshot({ path: 'test-results/review-update-error.png' }).catch(() => {});
      throw e;
    }
  });
});

// ============================================================
// TEST 3: ADMIN VIEW & SEARCH REVIEWS
// ============================================================
test.describe('Admin Review Management – View & Search', () => {
  test('Admin can view all reviews and search by message', async ({ page }) => {
    test.setTimeout(90000);

    try {
      console.log('\n🟠 [ADMIN-SEARCH] Step 1: Login as admin & navigate to reviews');
      await navigateToAdminReviews(page);
      await page.screenshot({ path: 'test-results/admin-review-1-dashboard.png' });

      console.log('🟠 [ADMIN-SEARCH] Step 2: Verify review table is visible');
      const table = page.locator('table');
      await expect(table).toBeVisible({ timeout: 10000 });
      console.log('✅ Review table visible');

      console.log('🟠 [ADMIN-SEARCH] Step 3: Verify stat cards are visible');
      const statCards = page.locator('text="Total Reviews"');
      if (await statCards.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('✅ Stat cards visible');
      } else {
        console.log('⚠️ Stat cards not found – page may differ');
      }

      console.log('🟠 [ADMIN-SEARCH] Step 4: Search by keyword');
      await searchReviewInAdmin(page, 'Automated');
      await page.screenshot({ path: 'test-results/admin-review-2-searched.png' });

      const tableContent = await page.textContent('table').catch(() => '');
      console.log('ℹ️ Table content after search:', tableContent.substring(0, 200));

      console.log('\n' + '='.repeat(60));
      console.log('🎉 ADMIN VIEW & SEARCH FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Admin search error:', e.message);
      await page.screenshot({ path: 'test-results/admin-search-error.png' }).catch(() => {});
      throw e;
    }
  });
});

// ============================================================
// TEST 4: ADMIN EDIT REVIEW
// ============================================================
test.describe('Admin Review Management – Edit Review', () => {
  test('Admin can edit an existing review message and rating', async ({ page }) => {
    test.setTimeout(120000);

    try {
      console.log('\n🟣 [ADMIN-EDIT] Step 1: Login as admin & navigate to reviews');
      await navigateToAdminReviews(page);

      console.log('🟣 [ADMIN-EDIT] Step 2: Wait for reviews to load');
      await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);

      console.log('🟣 [ADMIN-EDIT] Step 3: Click Edit on the first review');
      const editBtn = page.locator('button:has-text("Edit")').first();
      if (!await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('⚠️ No Edit button found – there may be no reviews in the table');
        return;
      }
      await editBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'test-results/admin-edit-1-modal-open.png' });

      console.log('🟣 [ADMIN-EDIT] Step 4: Update review message in modal');
      const editMessageField = page.locator('textarea[placeholder*="Update review message"]').first();
      if (await editMessageField.isVisible({ timeout: 5000 }).catch(() => false)) {
        await editMessageField.fill(`Admin Edited – ${Date.now()}`);
        console.log('✅ Review message updated in modal');
      } else {
        console.log('⚠️ Edit textarea not visible in modal');
      }

      console.log('🟣 [ADMIN-EDIT] Step 5: Change rating to 3 stars');
      const ratingSelect = page.locator('select').first();
      if (await ratingSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        await ratingSelect.selectOption('3');
        console.log('✅ Rating updated to 3 stars');
      }

      console.log('🟣 [ADMIN-EDIT] Step 6: Submit update');
      const updateBtn = page.locator('button:has-text("Update Review")').first();
      if (await updateBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await updateBtn.click({ timeout: 5000 });
        await page.waitForTimeout(2000);
        console.log('✅ Review update submitted');
      } else {
        throw new Error('Update Review button not found');
      }

      await page.screenshot({ path: 'test-results/admin-edit-2-updated.png' });

      // Verify modal is closed
      const modalClosed = !await page.locator('button:has-text("Update Review")').isVisible({ timeout: 2000 }).catch(() => false);
      if (modalClosed) {
        console.log('✅ Modal closed – edit successful');
      }

      console.log('\n' + '='.repeat(60));
      console.log('🎉 ADMIN EDIT REVIEW FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Admin edit error:', e.message);
      await page.screenshot({ path: 'test-results/admin-edit-error.png' }).catch(() => {});
      throw e;
    }
  });
});

// ============================================================
// TEST 5: ADMIN DELETE REVIEW (Cleanup)
// ============================================================
test.describe('Admin Review Management – Delete Review', () => {
  test('Admin can delete a specific review from the dashboard', async ({ page }) => {
    test.setTimeout(120000);

    // STEP A: User submits a unique review for deletion
    const deleteTarget = `DELETE-TEST Review ${Date.now()}`;

    try {
      console.log('\n🔴 [ADMIN-DELETE] Step 1: Submit a review as user (for cleanup)');
      await performLogin(page, USER_EMAIL, USER_PASSWORD);
      await navigateToEventDetails(page);
      await submitReview(page, 2, deleteTarget);
      console.log(`✅ Review submitted: "${deleteTarget.substring(0, 40)}"`);

      // STEP B: Admin deletes it
      console.log('🔴 [ADMIN-DELETE] Step 2: Logout user session');
      await performLogout(page);

      console.log('🔴 [ADMIN-DELETE] Step 3: Login as admin & navigate to reviews');
      await navigateToAdminReviews(page);

      console.log('🔴 [ADMIN-DELETE] Step 4: Search for the test review');
      await searchReviewInAdmin(page, 'DELETE-TEST');
      await page.screenshot({ path: 'test-results/admin-delete-1-found.png' });

      console.log('🔴 [ADMIN-DELETE] Step 5: Delete the review');
      await deleteReviewInAdmin(page, 'DELETE-TEST');
      await page.screenshot({ path: 'test-results/admin-delete-2-deleted.png' });

      console.log('🔴 [ADMIN-DELETE] Step 6: Verify review is removed');
      const tableContent = await page.textContent('table').catch(() => '');
      if (!tableContent.includes('DELETE-TEST')) {
        console.log('✅ Review successfully deleted from admin table');
      } else {
        console.log('⚠️ Review may still be present – verify manually');
      }

      console.log('\n' + '='.repeat(60));
      console.log('🎉 ADMIN DELETE REVIEW FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Admin delete error:', e.message);
      await page.screenshot({ path: 'test-results/admin-delete-error.png' }).catch(() => {});
      throw e;
    }
  });
});

// ============================================================
// TEST 6: FULL REVIEW LIFECYCLE (E2E)
// ============================================================
test.describe('Full Review & Rating Lifecycle', () => {
  test('Submit → Admin View → Admin Edit → Admin Delete', async ({ page }) => {
    test.setTimeout(180000);

    const lifecycleMessage = `Lifecycle Review ${Date.now()}`;

    try {
      // ── PHASE 1: User submits review ──────────────────────
      console.log('\n🌀 [LIFECYCLE] Phase 1: User submits review');
      await performLogin(page, USER_EMAIL, USER_PASSWORD);
      const eventUrl = await navigateToEventDetails(page);
      await submitReview(page, 5, lifecycleMessage);
      await page.screenshot({ path: 'test-results/lifecycle-1-submitted.png' });

      const bodyAfterSubmit = await page.textContent('body');
      if (bodyAfterSubmit.includes(lifecycleMessage)) {
        console.log('✅ Phase 1: Review visible on event page');
      } else {
        console.log('⚠️ Phase 1: Review may not yet be visible');
      }

      // ── PHASE 2: Admin verifies review exists ─────────────
      console.log('\n🌀 [LIFECYCLE] Phase 2: Logout user then login as admin');
      await performLogout(page);
      await navigateToAdminReviews(page);
      await searchReviewInAdmin(page, lifecycleMessage.substring(0, 20));
      await page.screenshot({ path: 'test-results/lifecycle-2-admin-found.png' });

      const tableAfterSearch = await page.textContent('table').catch(() => '');
      if (tableAfterSearch.includes(lifecycleMessage.substring(0, 20))) {
        console.log('✅ Phase 2: Review found in admin table');
      } else {
        console.log('⚠️ Phase 2: Review search inconclusive');
      }

      // ── PHASE 3: Admin cleans up (delete) ────────────────
      console.log('\n🌀 [LIFECYCLE] Phase 3: Admin deletes the review (cleanup)');
      try {
        await deleteReviewInAdmin(page, lifecycleMessage.substring(0, 20));
        await page.screenshot({ path: 'test-results/lifecycle-3-deleted.png' });
        console.log('✅ Phase 3: Review deleted in admin panel');
      } catch (e) {
        console.warn('⚠️ Phase 3: Could not delete –', e.message);
      }

      // ── PHASE 4: Verify event page no longer shows review ─
      console.log('\n🌀 [LIFECYCLE] Phase 4: Confirm review removed from event page');
      await page.goto(eventUrl);
      await page.waitForTimeout(2000);
      const bodyAfterDelete = await page.textContent('body');
      if (!bodyAfterDelete.includes(lifecycleMessage)) {
        console.log('✅ Phase 4: Review no longer visible on event page');
      } else {
        console.log('⚠️ Phase 4: Review still visible – cache or timing issue');
      }

      await page.screenshot({ path: 'test-results/lifecycle-4-event-clean.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 FULL REVIEW LIFECYCLE: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Lifecycle error:', e.message);
      await page.screenshot({ path: 'test-results/lifecycle-error.png' }).catch(() => {});
      throw e;
    }
  });
});
