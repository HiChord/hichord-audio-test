// Google Apps Script for HiChord Audio Test Backup
// Deploy this as a Web App to receive recordings

const FOLDER_ID = '1-pr9KgRZKqhI0QhhjhKXvKccpHqrLJpF';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const filename = data.filename || 'recording.wav';
    const base64Data = data.data;
    const mimeType = data.mimeType || 'audio/wav';

    // Decode base64 to blob
    const decoded = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decoded, mimeType, filename);

    // Get the target folder
    const folder = DriveApp.getFolderById(FOLDER_ID);

    // Save the file
    const file = folder.createFile(blob);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileName: file.getName()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
