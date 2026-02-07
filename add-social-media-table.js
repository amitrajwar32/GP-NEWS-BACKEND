import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'gn_news_portal',
});

async function addSocialMediaTable() {
  try {
    await client.connect();
    console.log('Creating social_media table...');
    
    // Drop table if exists
    await client.query('DROP TABLE IF EXISTS social_media CASCADE');
    
    // Create table
    await client.query(`
      CREATE TABLE social_media (
        id SERIAL PRIMARY KEY,
        platform_name VARCHAR(50) NOT NULL UNIQUE,
        url VARCHAR(500) NOT NULL,
        icon_name VARCHAR(50),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query('CREATE INDEX idx_platform ON social_media(platform_name)');
    await client.query('CREATE INDEX idx_display_order ON social_media(display_order)');
    
    console.log('✓ Social media table created');
    
    // Insert default data
    await client.query(`
      INSERT INTO social_media (platform_name, url, icon_name, display_order, is_active) VALUES
      ($1, $2, $3, $4, TRUE),
      ($5, $6, $7, $8, TRUE),
      ($9, $10, $11, $12, TRUE)
    `, ['Twitter', 'https://twitter.com', 'Twitter', 1,
        'Facebook', 'https://facebook.com', 'Facebook', 2,
        'LinkedIn', 'https://linkedin.com', 'Linkedin', 3]);
    
    console.log('✓ Default social media links inserted');
    
    // Verify
    const result = await client.query('SELECT COUNT(*) as count FROM social_media');
    console.log(`✓ Social media links count: ${result.rows[0].count}`);
    
  } finally {
    await client.end();
  }
}

addSocialMediaTable().catch(console.error);
