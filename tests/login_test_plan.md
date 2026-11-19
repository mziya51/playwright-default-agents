# ZincBank Login Test Plan

## Overview
This test plan covers the basic login functionality of the **ZincBank** web application located at `https://zincbank.cydeo.io/login`.  
The plan includes happy‑path scenarios, negative/edge‑case scenarios, and validation checks.  
All tests assume a fresh browser session with no prior authentication cookies or local storage.

## Test Scenarios

### 1. Successful Login (Happy Path)
**Title:** Valid credentials allow user to log in and reach the dashboard.  
**Pre‑conditions:**  
- Browser is opened to `https://zincbank.cydeo.io/login`.  
- No authentication cookies present.  
**Steps:**  
1. Verify the login page loads and displays the email and password fields, and a **Login** button.  
2. Enter **Email:** `student01@zinc.test`.  
3. Enter **Password:** `9pJolA7GBQec`.  
4. Click the **Login** button.  
5. Wait for navigation to complete.  
**Expected Result:**  
- User is redirected to the dashboard (e.g., `/dashboard` or home page).  
- A welcome message or user avatar is visible.  
- No error messages are shown.  

### 2. Invalid Email Format
**Title:** Email field validation rejects malformed email addresses.  
**Pre‑conditions:** Same as scenario 1.  
**Steps:**  
1. Enter **Email:** `invalid-email` (missing `@` and domain).  
2. Enter **Password:** any non‑empty string (e.g., `test`).  
3. Click **Login**.  
**Expected Result:**  
- An inline validation message appears (e.g., “Please enter a valid email address”).  
- Login request is **not** sent to the server.  

### 3. Empty Email Field
**Title:** Login is blocked when the email field is left blank.  
**Steps:**  
1. Leave **Email** empty.  
2. Enter **Password:** any value.  
3. Click **Login**.  
**Expected Result:**  
- Validation error indicating the email field is required.  

### 4. Empty Password Field
**Title:** Login is blocked when the password field is left blank.  
**Steps:**  
1. Enter a valid **Email** (`student01@zinc.test`).  
2. Leave **Password** empty.  
3. Click **Login**.  
**Expected Result:**  
- Validation error indicating the password field is required.  

### 5. Incorrect Password
**Title:** Correct email with wrong password shows authentication error.  
**Steps:**  
1. Enter **Email:** `student01@zinc.test`.  
2. Enter **Password:** `wrongPassword123`.  
3. Click **Login**.  
**Expected Result:**  
- Server returns an authentication error.  
- An error message such as “Invalid credentials” is displayed.  

### 6. Incorrect Email (Non‑existent Account)
**Title:** Non‑existent email address results in authentication error.  
**Steps:**  
1. Enter **Email:** `nonexistent@zinc.test`.  
2. Enter **Password:** any value.  
3. Click **Login**.  
**Expected Result:**  
- Authentication error displayed (same as scenario 5).  

### 7. Case Sensitivity of Email
**Title:** Verify email handling is case‑insensitive.  
**Steps:**  
1. Enter **Email:** `STUDENT01@ZINC.TEST`.  
2. Enter **Password:** `9pJolA7GBQec`.  
3. Click **Login**.  
**Expected Result:**  
- Login succeeds (email comparison is case‑insensitive).  

### 8. Password Length Edge Cases
**Title:** Verify minimum and maximum password length enforcement.  
**Steps:**  
1. Enter **Email:** `student01@zinc.test`.  
2. Enter **Password:** a string shorter than the allowed minimum (e.g., `a`).  
3. Click **Login**.  
4. Repeat with a very long password (e.g., 256 characters).  
**Expected Result:**  
- Client‑side validation prevents submission for too short passwords.  
- Server may reject overly long passwords; appropriate error displayed.  

### 9. Remember Me Checkbox (If Present)
**Title:** Verify “Remember Me” functionality persists login across sessions.  
**Steps:**  
1. Check the **Remember Me** box (if available).  
2. Perform a successful login (scenario 1).  
3. Close the browser window.  
4. Re‑open the browser and navigate to the base URL.  
**Expected Result:**  
- User remains logged in without needing to re‑enter credentials.  

### 10. Logout Flow
**Title:** Ensure user can log out and is redirected back to the login page.  
**Pre‑conditions:** User is logged in (scenario 1).  
**Steps:**  
1. Click the **Logout** button/link in the dashboard/header.  
2. Confirm any logout confirmation dialog if present.  
**Expected Result:**  
- User is redirected to the login page.  
- Session cookies are cleared.  

## General Assumptions
- The application uses standard HTML form elements with accessible labels.  
- All error messages are displayed inline near the relevant input fields.  
- Network latency is within reasonable limits; explicit waits are used where necessary.  

## Success Criteria
- All happy‑path scenarios complete without errors and land on the expected post‑login page.  
- All negative scenarios display appropriate validation or authentication messages and do not grant access.  

## Failure Conditions
- Any scenario that does not meet its expected result is considered a failure and must be logged with details (error message, screenshot, console logs).  

---

*Prepared by the QA automation team for the ZincBank login feature.*