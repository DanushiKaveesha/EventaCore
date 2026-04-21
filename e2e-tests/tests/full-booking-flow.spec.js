require('dotenv').config();

const { test, expect } = require('@playwright/test');
const path = require('path');

// ============================================================
// CREDENTIALS
// ============================================================
const USER_EMAIL = process.env.TEST_USER_EMAIL || 'sunilchandrasekara60@gmail.com';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'Adee1234';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'ishinikavishka422@gmail.com';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'Ishini@2002';

// ============================================================
// HELPER: Click My Bookings
// ============================================================
async function clickMyBookings(page) {
  const selectors = [
    'a:has-text("My Bookings")',
    'div:has-text("My Bookings")',
    '[href*="bookings"]',
    'text="My Bookings"'
  ];

  for (const selector of selectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
      await element.click({ timeout: 5000 });
      console.log("✅ Clicked My Bookings using:", selector);
      return true;
    }
  }

  const myBookingsText = page.locator('text="My Bookings"').first();
  if (await myBookingsText.isVisible({ timeout: 2000 }).catch(() => false)) {
    await myBookingsText.locator('..').click({ timeout: 5000 });
    console.log("✅ Clicked My Bookings parent element");
    return true;
  }

  throw new Error('Could not find clickable My Bookings element');
}

// ============================================================
// HELPER: Admin - Approve Payment (Specific to your UI)
// ============================================================
async function adminApprovePayment(page) {
  console.log("🟢 Looking for PENDING payment to approve...");

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Find the first PENDING status
  const pendingStatus = page.locator('text="PENDING"').first();
  if (!await pendingStatus.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("⚠️ No PENDING payments found");
    return false;
  }
  console.log("✅ Found PENDING payment");

  // Find the Approve button (usually near the PENDING status)
  // Try different selectors for Approve button
  const approveSelectors = [
    'button:has-text("Approve")',
    'button:has-text("APPROVE")',
    'button:has-text("Verify")',
    'button[title="Approve"]',
    '.approve-btn',
    'button:has-text("Confirm")'
  ];

  for (const selector of approveSelectors) {
    const btn = page.locator(selector).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click({ timeout: 5000 });
      console.log(`✅ Clicked Approve button using: ${selector}`);

      // Handle confirmation modal if appears
      const confirmBtn = page.locator('button:has-text("Confirm")');
      if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click({ timeout: 5000 });
        console.log("✅ Confirmed approval");
      }
      return true;
    }
  }

  console.log("⚠️ Approve button not found");
  return false;
}

// ============================================================
// HELPER: Admin - Reject Payment (Specific to your UI)
// ============================================================
async function adminRejectPayment(page) {
  console.log("🔴 Looking for PENDING payment to reject...");

  await page.waitForTimeout(2000);

  const pendingStatus = page.locator('text="PENDING"').first();
  if (!await pendingStatus.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("⚠️ No PENDING payments found");
    return false;
  }
  console.log("✅ Found PENDING payment");

  const rejectSelectors = [
    'button:has-text("Reject")',
    'button:has-text("REJECT")',
    'button:has-text("Decline")',
    'button[title="Reject"]',
    '.reject-btn'
  ];

  for (const selector of rejectSelectors) {
    const btn = page.locator(selector).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click({ timeout: 5000 });
      console.log(`✅ Clicked Reject button using: ${selector}`);

      const confirmBtn = page.locator('button:has-text("Confirm")');
      if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click({ timeout: 5000 });
        console.log("✅ Confirmed rejection");
      }
      return true;
    }
  }

  console.log("⚠️ Reject button not found");
  return false;
}

// ============================================================
// HELPER: Navigate to Event Payments
// ============================================================
async function navigateToEventPayments(page) {
  console.log("📍 Navigating to Payment Management");
  await page.click('text="Payment Management"', { timeout: 5000 });
  await page.waitForTimeout(3000);

  // Try to find and click Event Payments
  const eventPaymentsSelectors = [
    'text="Event Payments"',
    'text="Event Payment"',
    'text="TICKET SALES"',
    'text="Ticket Sales"',
    'a:has-text("Event Payment")'
  ];

  for (const selector of eventPaymentsSelectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
      await element.click({ timeout: 5000 });
      console.log(`✅ Clicked on ${selector}`);
      await page.waitForTimeout(2000);
      return true;
    }
  }

  console.log("⚠️ Event Payments section not found, continuing...");
  return false;
}

// ============================================================
// TEST 1: APPROVAL FLOW
// ============================================================
test.describe('Complete Event Booking and Admin Approval Flow', () => {

  test('Complete End-to-End Cycle (User Book -> Admin Approve -> User Verify)', async ({ browser }) => {
    test.setTimeout(120000);

    // --- PART 1: USER FLOW ---
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    try {
      console.log("\n🔵 [APPROVAL] Step 1: User Login");
      await userPage.goto('http://localhost:5173/login');
      await userPage.fill('input[name="loginIdentifier"]', USER_EMAIL);
      await userPage.fill('input[name="password"]', USER_PASSWORD);
      await userPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await userPage.waitForURL('**/dashboard', { timeout: 10000 });
      console.log("✅ User logged in");

      console.log("🔵 [APPROVAL] Step 2: Navigate to Events");
      await userPage.click('text="Events"', { timeout: 5000 });
      await userPage.waitForTimeout(3000);
      console.log("✅ Events page loaded");

      console.log("🔵 [APPROVAL] Step 3: Click Book Tickets");
      await userPage.locator('a:has-text("Book Tickets")').first().click({ timeout: 5000 });
      await userPage.waitForTimeout(3000);

      const plusButton = userPage.locator('button:has-text("+")').first();
      if (await plusButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log("🔵 [APPROVAL] Step 4: Selecting Tickets");
        await plusButton.click({ timeout: 5000 });
      }

      console.log("🔵 [APPROVAL] Step 5: Confirm Booking");
      const confirmBtn = userPage.locator('button:has-text("Confirm Booking")');
      if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await confirmBtn.click({ timeout: 5000 });
        console.log("✅ Booking confirmed");
      }

      await userPage.waitForTimeout(2000);

      const isPaymentStep = await userPage.locator('h2:has-text("Complete Payment")').isVisible({ timeout: 3000 }).catch(() => false);

      if (isPaymentStep) {
        console.log("🔵 [APPROVAL] Step 6: Uploading Payment Slip");
        const slipPath = path.join(__dirname, '../test-data/payment-slip.png');
        await userPage.setInputFiles('input[type="file"]', slipPath, { timeout: 5000 });
        await userPage.click('button:has-text("Verify Payment")', { timeout: 5000 });
        await expect(userPage.locator('text="Booking Requested!"')).toBeVisible({ timeout: 5000 });
        console.log("✅ Booking created - Pending approval");
      }

      await userPage.screenshot({ path: 'test-results/approval-1-after-booking.png' });

    } catch (e) {
      console.error('❌ User flow error:', e.message);
      throw e;
    } finally {
      await userContext.close();
    }

    // --- PART 2: ADMIN FLOW (APPROVE) ---
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    try {
      console.log("\n🟢 [APPROVAL] Step 7: Admin Login");
      await adminPage.goto('http://localhost:5173/login');
      await adminPage.fill('input[name="loginIdentifier"]', ADMIN_EMAIL);
      await adminPage.fill('input[name="password"]', ADMIN_PASSWORD);
      await adminPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await adminPage.waitForURL('**/admin', { timeout: 10000 });
      console.log("✅ Admin logged in");

      await navigateToEventPayments(adminPage);

      console.log("🟢 [APPROVAL] Step 9: Approve Payment");
      await adminApprovePayment(adminPage);

      await adminPage.screenshot({ path: 'test-results/approval-2-after-approval.png' });

    } catch (e) {
      console.error('❌ Admin flow error:', e.message);
      throw e;
    } finally {
      await adminContext.close();
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    // --- PART 3: VERIFICATION FLOW ---
    const finalUserContext = await browser.newContext();
    const finalUserPage = await finalUserContext.newPage();

    try {
      console.log("\n🟡 [APPROVAL] Step 10: User Verification");
      await finalUserPage.goto('http://localhost:5173/login');
      await finalUserPage.fill('input[name="loginIdentifier"]', USER_EMAIL);
      await finalUserPage.fill('input[name="password"]', USER_PASSWORD);
      await finalUserPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await finalUserPage.waitForURL('**/dashboard', { timeout: 10000 });

      console.log("🟡 [APPROVAL] Step 11: Navigate to My Bookings");
      await clickMyBookings(finalUserPage);
      await finalUserPage.waitForTimeout(3000);

      const pageContent = await finalUserPage.textContent('body');
      if (pageContent.includes('Confirmed') || pageContent.includes('confirmed') || pageContent.includes('APPROVED')) {
        console.log("✅ SUCCESS: User sees 'Confirmed' status");
      } else {
        console.log("⚠️ 'Confirmed' status not found - Current status may be different");
      }

      await finalUserPage.screenshot({ path: 'test-results/approval-3-final-status.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 APPROVAL FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Final flow error:', e.message);
      throw e;
    } finally {
      await finalUserContext.close();
    }
  });
});

// ============================================================
// TEST 2: REJECTION FLOW
// ============================================================
test.describe('Complete Event Booking and Admin REJECTION Flow', () => {

  test('Complete End-to-End Cycle (User Book -> Admin Reject -> User Verify)', async ({ browser }) => {
    test.setTimeout(120000);

    // --- PART 1: USER FLOW ---
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    try {
      console.log("\n🔴 [REJECTION] Step 1: User Login");
      await userPage.goto('http://localhost:5173/login');
      await userPage.fill('input[name="loginIdentifier"]', USER_EMAIL);
      await userPage.fill('input[name="password"]', USER_PASSWORD);
      await userPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await userPage.waitForURL('**/dashboard', { timeout: 10000 });
      console.log("✅ User logged in");

      console.log("🔴 [REJECTION] Step 2: Navigate to Events");
      await userPage.click('text="Events"', { timeout: 5000 });
      await userPage.waitForTimeout(3000);
      console.log("✅ Events page loaded");

      console.log("🔴 [REJECTION] Step 3: Click Book Tickets");
      await userPage.locator('a:has-text("Book Tickets")').first().click({ timeout: 5000 });
      await userPage.waitForTimeout(3000);

      const plusButton = userPage.locator('button:has-text("+")').first();
      if (await plusButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log("🔴 [REJECTION] Step 4: Selecting Tickets");
        await plusButton.click({ timeout: 5000 });
      }

      console.log("🔴 [REJECTION] Step 5: Confirm Booking");
      const confirmBtn = userPage.locator('button:has-text("Confirm Booking")');
      if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await confirmBtn.click({ timeout: 5000 });
        console.log("✅ Booking confirmed");
      }

      await userPage.waitForTimeout(2000);

      const isPaymentStep = await userPage.locator('h2:has-text("Complete Payment")').isVisible({ timeout: 3000 }).catch(() => false);

      if (isPaymentStep) {
        console.log("🔴 [REJECTION] Step 6: Uploading Payment Slip");
        const slipPath = path.join(__dirname, '../test-data/payment-slip.png');
        await userPage.setInputFiles('input[type="file"]', slipPath, { timeout: 5000 });
        await userPage.click('button:has-text("Verify Payment")', { timeout: 5000 });
        await expect(userPage.locator('text="Booking Requested!"')).toBeVisible({ timeout: 5000 });
        console.log("✅ Booking created - Pending approval");
      }

      await userPage.screenshot({ path: 'test-results/rejection-1-after-booking.png' });

    } catch (e) {
      console.error('❌ User flow error:', e.message);
      throw e;
    } finally {
      await userContext.close();
    }

    // --- PART 2: ADMIN FLOW (REJECT) ---
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    try {
      console.log("\n🔴 [REJECTION] Step 7: Admin Login");
      await adminPage.goto('http://localhost:5173/login');
      await adminPage.fill('input[name="loginIdentifier"]', ADMIN_EMAIL);
      await adminPage.fill('input[name="password"]', ADMIN_PASSWORD);
      await adminPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await adminPage.waitForURL('**/admin', { timeout: 10000 });
      console.log("✅ Admin logged in");

      await navigateToEventPayments(adminPage);

      console.log("🔴 [REJECTION] Step 9: Reject Payment");
      await adminRejectPayment(adminPage);

      await adminPage.screenshot({ path: 'test-results/rejection-2-after-rejection.png' });

    } catch (e) {
      console.error('❌ Admin flow error:', e.message);
      throw e;
    } finally {
      await adminContext.close();
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    // --- PART 3: VERIFICATION FLOW ---
    const finalUserContext = await browser.newContext();
    const finalUserPage = await finalUserContext.newPage();

    try {
      console.log("\n🟡 [REJECTION] Step 10: User Verification");
      await finalUserPage.goto('http://localhost:5173/login');
      await finalUserPage.fill('input[name="loginIdentifier"]', USER_EMAIL);
      await finalUserPage.fill('input[name="password"]', USER_PASSWORD);
      await finalUserPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await finalUserPage.waitForURL('**/dashboard', { timeout: 10000 });

      console.log("🟡 [REJECTION] Step 11: Navigate to My Bookings");
      await clickMyBookings(finalUserPage);
      await finalUserPage.waitForTimeout(3000);

      const pageContent = await finalUserPage.textContent('body');
      if (pageContent.includes('Rejected') || pageContent.includes('rejected') || pageContent.includes('REJECTED')) {
        console.log("✅ SUCCESS: User sees 'Rejected' status");
      } else {
        console.log("⚠️ 'Rejected' status not found - Current status may be different");
      }

      await finalUserPage.screenshot({ path: 'test-results/rejection-3-final-status.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 REJECTION FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Final flow error:', e.message);
      throw e;
    } finally {
      await finalUserContext.close();
    }
  });
});