const puppeteer = require('puppeteer');
const projectsData = require('../projects.json'); // Replace with the correct path to your JSON file

async function takeScreenshots() {
    const browser = await puppeteer.launch();

    for (const project of projectsData) {
        const page = await browser.newPage();
        await page.goto(project.link, { waitUntil: 'networkidle2' }); // Adjust the wait settings as needed
        await page.screenshot({ path: `${project.image.replace('assets/images/', '')}.png` });
        await page.close();
    }

    await browser.close();
}

takeScreenshots()
    .then(() => console.log('Screenshots captured successfully.'))
    .catch(error => console.error('Error capturing screenshots:', error));
