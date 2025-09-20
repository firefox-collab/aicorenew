# Google Sheets Integration Setup Instructions

## Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AI Core IT Solutions - Form Submissions"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 2: Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `google-apps-script.js`
4. Replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID
5. Save the project and name it "Form Submission Handler"

## Step 3: Deploy as Web App
1. In Google Apps Script, click "Deploy" > "New deployment"
2. Choose type: "Web app"
3. Set execute as: "Me"
4. Set access: "Anyone" (this allows your website to send data)
5. Click "Deploy"
6. Copy the web app URL

## Step 4: Update Your Website
1. In both `appointment.html` and `intake.html`, find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
2. Replace `YOUR_SCRIPT_ID` with your actual web app URL

## Step 5: Test the Integration
1. Submit a test form on your website
2. Check your Google Spreadsheet - you should see:
   - "Appointments" sheet for appointment form submissions
   - "Intake Forms" sheet for intake form submissions
   - Properly formatted headers and data

## Features Included:
- ✅ Automatic sheet creation with proper headers
- ✅ Data validation and error handling
- ✅ Timestamp for each submission
- ✅ Separate sheets for different form types
- ✅ Auto-resizing columns for better readability
- ✅ Loading states and user feedback
- ✅ Form reset after successful submission

## Optional Enhancements:
- Email notifications when forms are submitted
- Data validation on the server side
- Duplicate submission prevention
- Export functionality

## Security Notes:
- The web app is set to "Anyone" access, but data is only accepted via POST requests
- Consider adding additional validation if needed
- Monitor your Google Apps Script quotas

## Troubleshooting:
- If forms don't submit, check the browser console for errors
- Ensure the Google Apps Script web app is deployed and accessible
- Verify the spreadsheet ID and web app URL are correct
- Check Google Apps Script execution logs for server-side errors