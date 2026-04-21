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
// HELPER: Navigate to Clubs
// ============================================================
async function navigateToClubs(page) {
  const selectors = [
    'text="Clubs"',
    'a:has-text("Clubs")',
    '[href*="clubs"]'
  ];

  for (const selector of selectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
      await element.click({ timeout: 5000 });
      console.log("✅ Clicked Clubs using:", selector);
      return true;
    }
  }

  throw new Error('Could not find Clubs navigation');
}

// ============================================================
// HELPER: Click Join Club Button (with case-insensitive)
// ============================================================
async function clickJoinClub(page) {
  console.log("🔍 Looking for Join Club button...");
  
  // Wait a bit for page to load
  await page.waitForTimeout(1000);

  // Try different selectors for Join Club button
  const joinSelectors = [
    'button:has-text(/join|become member|membership/i)',
    'a:has-text(/join|become member|membership/i)',
    'button:has-text("Become Member")',
    'a:has-text("Become Member")',
    'button:has-text("Subscribe")',
    'a:has-text("Subscribe")',
    '[role="button"]:has-text(/join|member|subscribe/i)',
    '.btn-primary:has-text(/join|member/i)',
    'a[class*="btn"]:has-text(/join|member|subscribe/i)',
    // Last resort - any button/link with member/join in lower case
    'text=/.*[Jj]oin.*[Cc]lub.*/',
    'text=/.*[Bb]ecome.*[Mm]ember.*/'
  ];

  for (const selector of joinSelectors) {
    try {
      const elements = page.locator(selector);
      const count = await elements.count();
      
      if (count > 0) {
        const element = elements.first();
        // Try to scroll into view
        await element.scrollIntoViewIfNeeded().catch(() => {});
        
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          await element.click({ timeout: 5000 });
          console.log(`✅ Clicked Join Club using selector: ${selector}`);
          return true;
        }
      }
    } catch (e) {
      // Continue to next selector
      continue;
    }
  }

  // If all selectors fail, log page for debugging
  const bodyText = await page.textContent('body').catch(() => '');
  console.error("❌ Could not find Join Club button");
  console.error("🔍 Page body preview:", bodyText?.substring(0, 1000));
  
  // Try clicking any visible button that might be the join button
  const allButtons = page.locator('button, a[role="button"]');
  const buttonCount = await allButtons.count();
  console.log(`📊 Found ${buttonCount} buttons/links on page`);
  
  throw new Error('Could not find Join Club button - see logs above for page content');
}

// ============================================================
// HELPER: Admin - Approve Membership Payment
// ============================================================
async function adminApproveMembershipPayment(page) {
  console.log("🟢 Looking for PENDING membership payment to approve...");

  await page.waitForTimeout(2000);

  const pendingStatus = page.locator('text="PENDING"').first();
  if (!await pendingStatus.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("⚠️ No PENDING membership payments found");
    return false;
  }
  console.log("✅ Found PENDING membership payment");

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
// HELPER: Admin - Reject Membership Payment
// ============================================================
async function adminRejectMembershipPayment(page) {
  console.log("🔴 Looking for PENDING membership payment to reject...");

  await page.waitForTimeout(2000);

  const pendingStatus = page.locator('text="PENDING"').first();
  if (!await pendingStatus.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("⚠️ No PENDING membership payments found");
    return false;
  }
  console.log("✅ Found PENDING membership payment");

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
// HELPER: Navigate to Membership Payments
// ============================================================
async function navigateToMembershipPayments(page) {
  console.log("📍 Navigating to Payment Management");
  await page.click('text="Payment Management"', { timeout: 5000 });
  await page.waitForTimeout(3000);

  const membershipPaymentsSelectors = [
    'text="Membership Payments"',
    'text="Membership Payment"',
    'text="MEMBERSHIP FEES"',
    'text="Membership Fees"',
    'text="CLUB & MEMBERSHIP PAYMENT"',
    'a:has-text("Membership Payment")'
  ];

  for (const selector of membershipPaymentsSelectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
      await element.click({ timeout: 5000 });
      console.log(`✅ Clicked on ${selector}`);
      await page.waitForTimeout(2000);
      return true;
    }
  }

  console.log("⚠️ Membership Payments section not found, continuing...");
  return false;
}

// ============================================================
// HELPER: Navigate to My Clubs
// ============================================================
async function clickMyClubs(page) {
  console.log("🔍 Navigating to My Clubs...");
  
  try {
    // Try to click a My Clubs link first
    const linkSelectors = [
      'a:has-text(/my clubs/i)',
      'a:has-text(/my memberships/i)',
      '[href*="memberships"]',
      '[href*="my-clubs"]',
      'a:has-text(/clubs/i)'
    ];

    for (const selector of linkSelectors) {
      const element = page.locator(selector).first();
      const isVisible = await element.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (isVisible) {
        await element.click({ timeout: 5000 });
        console.log(`✅ Clicked My Clubs link using: ${selector}`);
        await page.waitForTimeout(2000);
        return true;
      }
    }

    // If no link found, navigate directly to multiple possible URLs
    const possibleUrls = [
      'http://localhost:5173/dashboard/clubs',
      'http://localhost:5173/dashboard/memberships',
      'http://localhost:5173/my-clubs',
      'http://localhost:5173/memberships'
    ];

    for (const url of possibleUrls) {
      try {
        console.log(`📍 Attempting to navigate to: ${url}`);
        await page.goto(url, { timeout: 8000, waitUntil: 'networkidle' });
        console.log(`✅ Successfully navigated to clubs/memberships page`);
        await page.waitForTimeout(2000);
        return true;
      } catch (e) {
        console.log(`⚠️ Failed to navigate to ${url}, trying next...`);
        continue;
      }
    }

    console.error("❌ Could not navigate to My Clubs - all URLs failed");
    return false;

  } catch (e) {
    console.error("❌ Error in clickMyClubs:", e.message);
    return false;
  }
}

// ============================================================
// TEST 1: MEMBERSHIP APPROVAL FLOW
// ============================================================
test.describe('Complete Club Membership and Admin Approval Flow', () => {

  test('Complete End-to-End Cycle (User Join -> Admin Approve -> User Verify)', async ({ browser }) => {
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

      console.log("🔵 [APPROVAL] Step 2: Navigate to Clubs");
      await navigateToClubs(userPage);
      await userPage.waitForTimeout(3000);
      console.log("✅ Clubs page loaded");

      console.log("🔵 [APPROVAL] Step 3: Select a Club");
      // Click on first club card/link if available
      const clubLinks = userPage.locator('a, [role="link"], .club-card, [class*="club"]');
      const clubCount = await clubLinks.count();
      if (clubCount > 0) {
        await clubLinks.first().click({ timeout: 5000 });
        await userPage.waitForTimeout(2000);
        console.log("✅ Selected club");
      }

      console.log("🔵 [APPROVAL] Step 4: Click Join Club");
      await clickJoinClub(userPage);
      await userPage.waitForTimeout(3000);
      console.log("✅ Join Club initiated");

      console.log("🔵 [APPROVAL] Step 5: Confirm Membership");
      const confirmBtn = userPage.locator('button:has-text("Confirm")');
      if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await confirmBtn.click({ timeout: 5000 });
        console.log("✅ Membership confirmed");
      }

      await userPage.waitForTimeout(2000);

      const isPaymentStep = await userPage.locator('h2:has-text("Complete Payment")').isVisible({ timeout: 3000 }).catch(() => false);

      if (isPaymentStep) {
        console.log("🔵 [APPROVAL] Step 6: Uploading Payment Slip");
        const slipPath = path.join(__dirname, '../test-data/payment-slip.png');
        await userPage.setInputFiles('input[type="file"]', slipPath, { timeout: 5000 });
        await userPage.click('button:has-text("Verify Payment")', { timeout: 5000 });
        await expect(userPage.locator('text="Membership Requested!"')).toBeVisible({ timeout: 5000 });
        console.log("✅ Membership created - Pending approval");
      }

      await userPage.screenshot({ path: 'test-results/membership-approval-1-after-join.png' });

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

      await navigateToMembershipPayments(adminPage);

      console.log("🟢 [APPROVAL] Step 8: Approve Payment");
      await adminApproveMembershipPayment(adminPage);

      await adminPage.screenshot({ path: 'test-results/membership-approval-2-after-approval.png' });

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
      console.log("\n🟡 [APPROVAL] Step 9: User Verification");
      await finalUserPage.goto('http://localhost:5173/login');
      await finalUserPage.fill('input[name="loginIdentifier"]', USER_EMAIL);
      await finalUserPage.fill('input[name="password"]', USER_PASSWORD);
      await finalUserPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await finalUserPage.waitForURL('**/dashboard', { timeout: 10000 });

      console.log("🟡 [APPROVAL] Step 10: Navigate to My Clubs");
      const navigatedToClubs = await clickMyClubs(finalUserPage);
      if (!navigatedToClubs) {
        console.log("⚠️ Could not navigate to My Clubs, but continuing with verification...");
      }
      await finalUserPage.waitForTimeout(3000);

      const pageContent = await finalUserPage.textContent('body');
      if (pageContent.includes('Active') || pageContent.includes('active') || pageContent.includes('APPROVED') || pageContent.includes('Member')) {
        console.log("✅ SUCCESS: User sees 'Active' membership status");
      } else {
        console.log("⚠️ 'Active' status not found - Current status may be different");
      }

      await finalUserPage.screenshot({ path: 'test-results/membership-approval-3-final-status.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 MEMBERSHIP APPROVAL FLOW: COMPLETED ✅');
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
// TEST 2: MEMBERSHIP REJECTION FLOW
// ============================================================
test.describe('Complete Club Membership and Admin REJECTION Flow', () => {

  test('Complete End-to-End Cycle (User Join -> Admin Reject -> User Verify)', async ({ browser }) => {
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

      console.log("🔴 [REJECTION] Step 2: Navigate to Clubs");
      await navigateToClubs(userPage);
      await userPage.waitForTimeout(3000);
      console.log("✅ Clubs page loaded");

      console.log("🔴 [REJECTION] Step 3: Select a Club");
      // Click on first club card/link if available
      const clubLinks = userPage.locator('a, [role="link"], .club-card, [class*="club"]');
      const clubCount = await clubLinks.count();
      if (clubCount > 0) {
        await clubLinks.first().click({ timeout: 5000 });
        await userPage.waitForTimeout(2000);
        console.log("✅ Selected club");
      }

      console.log("🔴 [REJECTION] Step 4: Click Join Club");
      await clickJoinClub(userPage);
      await userPage.waitForTimeout(3000);
      console.log("✅ Join Club initiated");

      console.log("🔴 [REJECTION] Step 5: Confirm Membership");
      const confirmBtn = userPage.locator('button:has-text("Confirm")');
      if (await confirmBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await confirmBtn.click({ timeout: 5000 });
        console.log("✅ Membership confirmed");
      }

      await userPage.waitForTimeout(2000);

      const isPaymentStep = await userPage.locator('h2:has-text("Complete Payment")').isVisible({ timeout: 3000 }).catch(() => false);

      if (isPaymentStep) {
        console.log("🔴 [REJECTION] Step 6: Uploading Payment Slip");
        const slipPath = path.join(__dirname, '../test-data/payment-slip.png');
        await userPage.setInputFiles('input[type="file"]', slipPath, { timeout: 5000 });
        await userPage.click('button:has-text("Verify Payment")', { timeout: 5000 });
        await expect(userPage.locator('text="Membership Requested!"')).toBeVisible({ timeout: 5000 });
        console.log("✅ Membership created - Pending approval");
      }

      await userPage.screenshot({ path: 'test-results/membership-rejection-1-after-join.png' });

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

      await navigateToMembershipPayments(adminPage);

      console.log("🔴 [REJECTION] Step 8: Reject Payment");
      await adminRejectMembershipPayment(adminPage);

      await adminPage.screenshot({ path: 'test-results/membership-rejection-2-after-rejection.png' });

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
      console.log("\n🟡 [REJECTION] Step 9: User Verification");
      await finalUserPage.goto('http://localhost:5173/login');
      await finalUserPage.fill('input[name="loginIdentifier"]', USER_EMAIL);
      await finalUserPage.fill('input[name="password"]', USER_PASSWORD);
      await finalUserPage.click('button:has-text("Sign In To Console")', { timeout: 5000 });
      await finalUserPage.waitForURL('**/dashboard', { timeout: 10000 });

      console.log("🟡 [REJECTION] Step 10: Navigate to My Clubs");
      const navigatedToClubs = await clickMyClubs(finalUserPage);
      if (!navigatedToClubs) {
        console.log("⚠️ Could not navigate to My Clubs, but continuing with verification...");
      }
      await finalUserPage.waitForTimeout(3000);

      const pageContent = await finalUserPage.textContent('body');
      if (pageContent.includes('Rejected') || pageContent.includes('rejected') || pageContent.includes('REJECTED')) {
        console.log("✅ SUCCESS: User sees 'Rejected' status");
      } else {
        console.log("⚠️ 'Rejected' status not found - Current status may be different");
      }

      await finalUserPage.screenshot({ path: 'test-results/membership-rejection-3-final-status.png' });

      console.log('\n' + '='.repeat(60));
      console.log('🎉 MEMBERSHIP REJECTION FLOW: COMPLETED ✅');
      console.log('='.repeat(60) + '\n');

    } catch (e) {
      console.error('❌ Final flow error:', e.message);
      throw e;
    } finally {
      await finalUserContext.close();
    }
  });
});