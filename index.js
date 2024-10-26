require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const filePath = path.join(__dirname, 'list-users.png');

async function uploadFile() {

    try {
        const response = await drive.files.create({
            requestBody: {
                name: 'sample.png',
                mimeType: 'image/png'
            },
            media: {
                mimeType: 'image/png',
                body: fs.createReadStream(filePath)
            }
        });

        console.log(response.data);
        console.log('File ID:', response.data.id);
        
    } catch (error) {
        console.log(error.message)
        
    }
    
}

async function downloadFile(fileId, dest) {
    const destPath = path.join(__dirname, dest);

    const fileStream = fs.createWriteStream(destPath);

    try {
        const response = await drive.files.get({
            fileId: fileId,
            alt: 'media'
        }, { responseType: 'stream' });

        response.data
            .on('end', () => {
                console.log('File downloaded successfully to:', destPath);
            })
            .on('error', (err) => {
                console.error('Error downloading file:', err);
            })
            .pipe(fileStream);
    } catch (error) {
        console.error('Error fetching file:', error.message);
    }
}

// uploadFile();
downloadFile('1wN5nNeXZdzqpjYjZKokXdXk6PSlt6GtB', 'downloaded_file.png');
