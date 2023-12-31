import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

app.get('/.netlify/functions/server/download', async (req, res) => {
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
        stream.on("complete", function end() {
            'use-strict';
            console.log(`${title}` + " already downloaded!")
        });
        stream.on('finish', () => {
            console.log('Video saved successfully!');
        });
        res.status(200).send('Download function reached')
    } catch (err) {
        console.error('Error saving the video:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
module.exports = app;
