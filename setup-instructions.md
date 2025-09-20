# Google Sheets Integration Setup Instructions

## Step 1: Create a Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AI Core IT Solutions - Form Submissions"
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123xyz456DEF789/edit`
   - The ID is: `1ABC123xyz456DEF789`

## Step 2: Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `google-apps-script.js`
4. **CRITICAL**: Replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID from Step 1
5. Save the project (Ctrl+S) and name it "Form Submission Handler"

## Step 3: Test Your Setup (IMPORTANT!)
1. In Google Apps Script, click on the function dropdown and select `testSetup`
2. Click the "Run" button (▶️)
3. Grant permissions when prompted
4. Check the "Execution log" - you should see "SUCCESS" messages
5. If you see errors, double-check your spreadsheet ID

## Step 4: Deploy as Web App
1. In Google Apps Script, click "Deploy" > "New deployment"
2. Click the gear icon ⚙️ next to "Type" and select "Web app"
3. Set the following:
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. **Copy the web app URL** (it looks like: `https://script.google.com/macros/s/ABC123.../exec`)

## Step 5: Update Your Website
1. In `index.html`, find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
   Replace `YOUR_SCRIPT_ID` with your web app URL

2. In `appointment.html`, find the same line and replace it

3. In `intake.html`, find the same line and replace it

## Step 6: Test the Integration
1. Submit a test form on your website
2. Check your Google Spreadsheet - you should see new sheets:
   - "Contact Forms" sheet
   - "Appointments" sheet  
   - "Intake Forms" sheet
3. Each sheet should have cyan headers and your test data

## 🔧 Troubleshooting Guide

### Problem: "Please replace YOUR_SPREADSHEET_ID" error
**Solution**: You didn't replace the placeholder in the Google Apps Script code
- Go back to Google Apps Script
- Find line: `const spreadsheetId = 'YOUR_SPREADSHEET_ID';`
- Replace with your actual ID: `const spreadsheetId = '1ABC123xyz456DEF789';`

### Problem: "The caller does not have permission" error
**Solution**: 
1. In Google Apps Script, go to "Deploy" > "Manage deployments"
2. Click the pencil icon to edit
3. Make sure "Who has access" is set to "Anyone"
4. Click "Deploy"

### Problem: Forms submit but no data appears in sheets
**Solution**:
1. Check the Google Apps Script "Executions" tab for errors
2. Make sure you're using the correct web app URL in your HTML files
3. Try running the `testSetup` function again

### Problem: "Script function not found" error
**Solution**:
1. Make sure you copied the entire `google-apps-script.js` code
2. Save the script and try deploying again

## 📊 What You'll Get

**Automatic Features:**
- ✅ Real-time data saving to Google Sheets
- ✅ Separate sheets for each form type
- ✅ Professional cyan headers with black text
- ✅ Timestamps for each submission
- ✅ Auto-resizing columns
- ✅ Error logging for troubleshooting

**Data Captured:**
- **Contact Form**: Timestamp, Name, Email, Phone, Message
- **Appointment Form**: Timestamp, Name, Email, Phone, Date, Time, Services, Message  
- **Intake Form**: Timestamp, Name, Email, Services, Company Size, Communication Method, Timeline, Budget, Infrastructure, Challenges, Comments

## 🎯 Pro Tips
- Test with the `testSetup` function before deploying
- Check Google Apps Script execution logs if something goes wrong
- Make sure your spreadsheet is accessible (not restricted)
- Keep your web app URL secure - don't share it publicly

Once properly set up, all form submissions will automatically save to your Google Sheets in real-time!