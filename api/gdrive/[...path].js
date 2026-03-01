export default async function handler(req, res) {
    // Extract the file ID from the URL path
    // URL pattern: /api/gdrive/d/{fileId}
    const { path } = req.query;
    const pathArr = Array.isArray(path) ? path : [path];

    // Expect path to be ['d', '{fileId}']
    const fileId = pathArr[1] || pathArr[0];

    if (!fileId) {
        return res.status(400).json({ error: 'Missing file ID' });
    }

    // Try multiple Google Drive image URL formats
    const urls = [
        `https://lh3.googleusercontent.com/d/${fileId}`,
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
        `https://drive.google.com/uc?export=view&id=${fileId}`,
    ];

    for (const url of urls) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
                    'Accept': 'image/*,*/*',
                },
                redirect: 'follow',
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type') || 'image/jpeg';
                // Only proxy actual image responses
                if (contentType.startsWith('image/') || contentType.startsWith('application/octet-stream')) {
                    const buffer = await response.arrayBuffer();
                    res.setHeader('Content-Type', contentType);
                    res.setHeader('Cache-Control', 'public, max-age=86400');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    return res.status(200).send(Buffer.from(buffer));
                }
            }
        } catch (err) {
            // Try next URL
            continue;
        }
    }

    return res.status(404).json({ error: 'Image not found' });
}
