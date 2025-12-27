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
app.use(express.static('.')); // Serve static files from root directory

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

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

// Proxy for Cobalt API to avoid CORS issues
app.post('/api/cobalt', async (req, res) => {
    try {
        const response = await fetch('https://api.cobalt.best/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify(req.body)
        });


        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (response.status >= 400) {
                console.error('Cobalt API Error:', response.status, data);
            }
            res.status(response.status).json(data);
        } else {
            const text = await response.text();
            console.error('Non-JSON Cobalt Response:', response.status, text.substring(0, 200));
            res.status(response.status).json({ error: 'Upstream server returned non-JSON response', text: text.substring(0, 500) });
        }
    } catch (err) {
        console.error('Proxy Exception:', err);
        res.status(500).json({ error: 'Failed to reach Cobalt API: ' + err.message });
    }
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, 'localhost', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
