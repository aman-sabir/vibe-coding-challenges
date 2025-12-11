const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeContent(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const title = $('title').text() || $('h1').first().text();

        // Basic extraction of text from paragraphs
        let content = '';
        $('p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 50) { // filter out short snippets
                content += text + '\n\n';
            }
        });

        // Limit content length for AI processing if needed (e.g., first 10k chars)
        return {
            title: title.trim(),
            content: content.slice(0, 20000) // generous limit
        };
    } catch (error) {
        console.error('Scraping error:', error.message);
        throw new Error('Failed to scrape content');
    }
}

module.exports = { scrapeContent };
