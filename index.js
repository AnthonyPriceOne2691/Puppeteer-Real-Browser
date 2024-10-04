const { connect } = require('puppeteer-real-browser');
const fs = require('fs');
const csv = require('csv-parser');

const pathCSV = 'domains.csv';

async function readDomainsFromCSV(pathCSV) {
  return new Promise((resolve, reject) => {
    const domains = [];
    fs.createReadStream(pathCSV)
      .pipe(csv())
      .on('data', (row) => {
        domains.push(row.domain);
      })
      .on('end', () => {
        resolve(domains);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function getTitle() {
  const { browser, page } = await connect({
    headless: false,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  const domains = await readDomainsFromCSV(pathCSV);

  for (const domain of domains) {
    try {
      await page.goto(domain, { waitUntil: 'load' });
      const title = await page.title();
      console.log(`Page Title for ${domain}:`, title);
    } catch (err) {
      console.error(`Error loading ${domain}`);
    }
  }
  await browser.close();
}

getTitle();
