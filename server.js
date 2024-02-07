import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const corsOptions = {
  origin: 'https://localhost:5501', // Allow requests from this origin
  methods: ['GET', 'POST'],      // Allow only specified HTTP methods
};

const app = express();

app.use(cors());
app.use(express.json());
app.get('/server/download', async (req, res) => {
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
            console.log(`${title}` + " already downloaded!");
        });
        stream.on('finish', () => {
            console.log('Video saved successfully!');
        });
    } catch (err) {
        console.error('Error in the download function:', err);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});
const PORT = process.env.PORT || 8888;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export { app };
