/**
 * SECURE Google Apps Script for Anonymous Guestbook
 * WITH CORS SUPPORT
 * 
 * SETUP:
 * 1. Create Sheet with: "Messages" sheet (Timestamp | Username | Message)
 * 2. Create Sheet: "RateLimits" (ClientID | LastPost | PostCount | Blocked)
 * 3. Replace SHEET_ID below
 * 4. Deploy: Extensions > Apps Script > Deploy > New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the URL to your React component
 */

// ⚠️ REPLACE with your Google Sheet ID
const SHEET_ID = '1frOnpAx9p1glg4I5kckilTQtEbN96bCJs2U-xEWiwJo';

const SECURITY = {
    MAX_MESSAGE_LENGTH: 280,
    MAX_POSTS_PER_MINUTE: 3,
    COOLDOWN_SECONDS: 20,
    BLOCKED_PATTERNS: [
        /https?:\/\//i,
        /www\./i,
        /<script/i,
        /<[^>]*>/,
        /javascript:/i,
    ]
};

function getSheet(name) {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet && name === 'RateLimits') {
        // Auto-create RateLimits sheet if it doesn't exist
        sheet = spreadsheet.insertSheet(name);
        sheet.appendRow(['ClientID', 'LastPost', 'PostCount', 'Blocked']);
    }
    return sheet || spreadsheet.getSheets()[0];
}

// Handle GET requests
function doGet(e) {
    const output = handleRequest(e);
    return output;
}

// Handle POST requests  
function doPost(e) {
    const output = handleRequest(e);
    return output;
}

function handleRequest(e) {
    const action = e.parameter.action;
    let result;

    if (action === 'get') {
        result = getMessages();
    } else if (action === 'post') {
        const username = e.parameter.username;
        const message = e.parameter.message;
        const clientId = generateClientId(username);

        // Security checks
        const securityCheck = validateRequest({ username, message }, clientId);
        if (!securityCheck.valid) {
            result = { error: securityCheck.reason };
        } else {
            const rateLimitCheck = checkRateLimit(clientId);
            if (!rateLimitCheck.allowed) {
                result = { error: rateLimitCheck.reason };
            } else {
                result = addMessage(username, message, clientId);
            }
        }
    } else {
        result = { error: 'Invalid action' };
    }

    // Return JSONP-compatible response
    const callback = e.parameter.callback;
    if (callback) {
        return ContentService
            .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
            .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}

function generateClientId(username) {
    const hash = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        username + '_guestbook_salt_12345'
    );
    return Utilities.base64Encode(hash).substring(0, 16);
}

function validateRequest(data, clientId) {
    if (!data.username || !data.message) {
        return { valid: false, reason: 'Missing required fields' };
    }

    if (data.message.length > SECURITY.MAX_MESSAGE_LENGTH) {
        return { valid: false, reason: 'Message too long' };
    }

    if (data.message.trim().length === 0) {
        return { valid: false, reason: 'Empty message' };
    }

    for (const pattern of SECURITY.BLOCKED_PATTERNS) {
        if (pattern.test(data.message)) {
            return { valid: false, reason: 'Message contains blocked content' };
        }
    }

    if (isDuplicateMessage(data.username, data.message)) {
        return { valid: false, reason: 'Duplicate message' };
    }

    return { valid: true };
}

function checkRateLimit(clientId) {
    try {
        const sheet = getSheet('RateLimits');
        const data = sheet.getDataRange().getValues();
        const now = new Date();

        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === clientId) {
                const lastPost = new Date(data[i][1]);
                const postCount = data[i][2] || 0;
                const blocked = data[i][3];

                if (blocked) {
                    return { allowed: false, reason: 'You have been blocked' };
                }

                const timeSinceLastPost = (now - lastPost) / 1000;

                if (timeSinceLastPost < SECURITY.COOLDOWN_SECONDS) {
                    return {
                        allowed: false,
                        reason: `Wait ${Math.ceil(SECURITY.COOLDOWN_SECONDS - timeSinceLastPost)}s`
                    };
                }

                if (timeSinceLastPost > 60) {
                    sheet.getRange(i + 1, 2).setValue(now.toISOString());
                    sheet.getRange(i + 1, 3).setValue(1);
                    return { allowed: true };
                }

                if (postCount >= SECURITY.MAX_POSTS_PER_MINUTE) {
                    return { allowed: false, reason: 'Too many messages. Wait a minute.' };
                }

                sheet.getRange(i + 1, 2).setValue(now.toISOString());
                sheet.getRange(i + 1, 3).setValue(postCount + 1);
                return { allowed: true };
            }
        }

        sheet.appendRow([clientId, now.toISOString(), 1, false]);
        return { allowed: true };
    } catch (e) {
        return { allowed: true }; // Allow if rate limit sheet fails
    }
}

function isDuplicateMessage(username, message) {
    const sheet = getSheet('Messages');
    const data = sheet.getDataRange().getValues();
    const recent = data.slice(-20);

    for (const row of recent) {
        if (row[1] === username && row[2] === message) {
            return true;
        }
    }
    return false;
}

function sanitizeMessage(message) {
    return message
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, SECURITY.MAX_MESSAGE_LENGTH);
}

function getMessages() {
    const sheet = getSheet('Messages');
    const data = sheet.getDataRange().getValues();

    const messages = data.slice(1)
        .reverse()
        .slice(0, 50)
        .map(row => ({
            timestamp: row[0],
            username: row[1],
            message: row[2]
        }));

    return { messages };
}

function addMessage(username, message, clientId) {
    const cleanMessage = sanitizeMessage(message);

    if (cleanMessage.length === 0) {
        return { error: 'Invalid message' };
    }

    const sheet = getSheet('Messages');
    const timestamp = new Date().toISOString();

    sheet.appendRow([timestamp, username, cleanMessage]);

    return {
        success: true,
        message: { timestamp, username, message: cleanMessage }
    };
}
