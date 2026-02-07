import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'gn_news_portal',
});

async function checkAdmin() {
  try {
    await client.connect();
    console.log('Checking admin user...\n');
    const result = await client.query('SELECT id, username, email, is_active FROM admins');
    console.log('Admin records:', result.rows);
    
    // Get password hash to verify
    const adminResult = await client.query('SELECT password FROM admins WHERE username = $1', ['admin']);
    if (adminResult.rows.length > 0) {
      console.log('\nAdmin password hash exists:', adminResult.rows[0].password.substring(0, 20) + '...');
    }
    
    console.log('\nCategories:');
    const catsResult = await client.query('SELECT id, name, slug FROM categories');
    console.log(catsResult.rows);
  } finally {
    await client.end();
  }
}

checkAdmin().catch(console.error);
