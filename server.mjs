import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const router = express.Router();
app.use(cors());
router.get('/download', async(req, res) => {
    try {
        var URL = req.query.URL;
        var title = req.query.title;
        var format = req.query.format;
        var stream = ytdl(URL);
        stream.on("info", (info) => {
            const videoFormat = ytdl.chooseFormat(info.formats, { quality: '18' });
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            if (format === 'mp4') {
                res.header('Content-Disposition', "attachment; filename=" + `${title}` + ".mp4");
                ytdl(URL, {
                    format: videoFormat
                }).pipe(res);
            } else if (format === 'mp3') {
                res.header('Content-Disposition', "attachment; filename=" + `${title}` + ".mp3");
                ytdl(URL, {
                    format: audioFormat,
                    filter: 'audioonly',
                }).pipe(res);
            }
        });
        stream.on("complete", function complete() {
            'use-strict';
            console.log(`${title}` + "already downloaded!")
        });
        stream.on('finish', () => {
            console.log('Video saved successfully!');
        });
    } catch (err) {
        console.error('Error saving the video:', err);
    }
});
app.use('/api', router);

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const socketPath = path.resolve(__dirname, 'socket.sock'); // Replace with your desired socket file path

// Create the socket file
if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
}

const server = http.createServer(app);
server.listen(socketPath, () => {
    fs.chmodSync(socketPath, '777');
    console.log(`Server is running on Unix socket ${socketPath}`);
});