require('dotenv').config();
const { google } = require('googleapis');
const nodemailer = require('nodemailer'); // Using nodemailer
const path = require('path');

// Load your OAuth2 credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Create an OAuth2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set refresh token
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to create and send the email
const sendMail = async (options) => {
    try {
        // const accessToken = await oAuth2Client.getAccessToken();

        // Create transporter with OAuth2
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'sudhanshu3430@gmail.com', // Email of the user you want to impersonate
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                // accessToken: accessToken.token,
            },
        });

        // Send mail
        const info = await transporter.sendMail(options);
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Email options
const options = {
    from: 'sudhanshu3430@gmail.com',
    to: 'infiniteloop558@gmail.com',
    subject: 'Hello World 🚀',
    text: 'This email is sent from the command line',
    headers: [
        { key: 'X-Application-Developer', value: 'Sudhanshu Singh' },
        { key: 'X-Application-Version', value: 'v1.0.0.2' },
    ],
};

// Call the sendMail function
sendMail(options);
