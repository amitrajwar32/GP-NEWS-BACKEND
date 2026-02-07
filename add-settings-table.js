import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'gn_news_portal',
});

async function addSettingsTable() {
  try {
    await client.connect();
    console.log('Creating site_settings table...');
    
    // Drop table if exists
    await client.query('DROP TABLE IF EXISTS site_settings CASCADE');
    
    // Create table
    await client.query(`
      CREATE TABLE site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query('CREATE INDEX idx_key ON site_settings(setting_key)');
    
    console.log('✓ Site settings table created');
    
    // Insert default YouTube channel setting
    await client.query(`
      INSERT INTO site_settings (setting_key, setting_value, description) VALUES
      ($1, $2, $3)
    `, ['youtube_channel_url', 'https://www.youtube.com/channel/GNNews', 'YouTube channel URL']);
    
    console.log('✓ Default YouTube channel setting inserted');
    
    // Verify
    const result = await client.query('SELECT COUNT(*) as count FROM site_settings');
    console.log(`✓ Site settings count: ${result.rows[0].count}`);
    
  } finally {
    await client.end();
  }
}

addSettingsTable().catch(console.error);
