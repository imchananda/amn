export default async function handler(req, res) {
    const { gid } = req.query;
    const sheetId = process.env.SHEET_ID;

    if (!sheetId || !gid) {
        return res.status(400).json({ error: 'Missing sheet ID or gid' });
    }

    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch from Google Sheets' });
        }

        const text = await response.text();
        // Allow CORS if necessary (mostly not needed if frontend and API are on same domain, but good for local dev)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.status(200).send(text);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal server error while fetching data' });
    }
}
