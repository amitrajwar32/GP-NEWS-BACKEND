import pool from '../src/config/database.js';

// Extract first image src helper (same regex as models)
const extractFirstImage = (html) => {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']?([^"'> ]+)["']?/i);
  return match ? match[1] : null;
};

(async () => {
  try {
    console.log('Scanning news for missing thumbnails...');
    const result = await pool.query('SELECT id, content FROM news WHERE thumbnail IS NULL OR thumbnail = \'\'');
    const rows = result.rows;
    console.log(`Found ${rows.length} items without thumbnail`);

    let updated = 0;
    for (const r of rows) {
      const src = extractFirstImage(r.content || '');
      if (src) {
        await pool.query('UPDATE news SET thumbnail = $1 WHERE id = $2', [src, r.id]);
        updated++;
        console.log(`Updated news id=${r.id} -> ${src}`);
      }
    }

    console.log(`Migration complete. Updated ${updated} records.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
