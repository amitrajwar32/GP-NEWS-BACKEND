import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'gn_news_portal',
});

async function resetDatabase() {
  try {
    await client.connect();
    console.log('Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS news CASCADE');
    await client.query('DROP TABLE IF EXISTS contacts CASCADE');
    await client.query('DROP TABLE IF EXISTS social_media CASCADE');
    await client.query('DROP TABLE IF EXISTS categories CASCADE');
    await client.query('DROP TABLE IF EXISTS admins CASCADE');
    await client.query('DROP TABLE IF EXISTS site_settings CASCADE');
    console.log('✓ All tables dropped');
  } finally {
    await client.end();
  }
}

resetDatabase().catch(console.error);
