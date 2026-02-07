import pkg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

// Create PostgreSQL Connection Pool with Render support
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gn_news_portal',
  port: parseInt(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
  ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  // Connection string fallback for Render
  ...(process.env.DATABASE_URL && { connectionString: process.env.DATABASE_URL })
};

const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database with auto table creation
async function initializeDatabase() {
  try {
    const client = await pool.connect();

    // Create admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_username ON admins(username);
      CREATE INDEX IF NOT EXISTS idx_email ON admins(email);
    `);

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_slug ON categories(slug);
      CREATE INDEX IF NOT EXISTS idx_name ON categories(name);
    `);

    // Create news table
    await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        thumbnail VARCHAR(500),
        category_id INT NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
        views INT DEFAULT 0,
        admin_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_slug ON news(slug);
      CREATE INDEX IF NOT EXISTS idx_category ON news(category_id);
      CREATE INDEX IF NOT EXISTS idx_status ON news(status);
      CREATE INDEX IF NOT EXISTS idx_created_at ON news(created_at);
      CREATE INDEX IF NOT EXISTS idx_title ON news(title);
    `);

    // Create contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_email ON contacts(email);
      CREATE INDEX IF NOT EXISTS idx_created_at ON contacts(created_at);
    `);

    // Create social_media table
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_media (
        id SERIAL PRIMARY KEY,
        platform_name VARCHAR(50) NOT NULL UNIQUE,
        url VARCHAR(500) NOT NULL,
        icon_name VARCHAR(50),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_platform ON social_media(platform_name);
      CREATE INDEX IF NOT EXISTS idx_display_order ON social_media(display_order);
    `);

    // Create site_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_setting_key ON site_settings(setting_key);
    `);

    // Check if default admin exists
    const adminResult = await client.query('SELECT COUNT(*) as count FROM admins');
    if (parseInt(adminResult.rows[0].count) === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        `INSERT INTO admins (username, email, password, is_active) 
         VALUES ($1, $2, $3, TRUE)`,
        ['admin', 'admin@gnewsportal.com', hashedPassword]
      );
      console.log('✓ Default admin created');
      console.log('  Email: admin@gnewsportal.com');
      console.log('  Password: admin123');
    }

    // Check if default categories exist
    const categoryResult = await client.query('SELECT COUNT(*) as count FROM categories');
    if (parseInt(categoryResult.rows[0].count) === 0) {
      const categories = [
        ['Technology', 'technology', 'Latest technology news and updates'],
        ['Business', 'business', 'Business news and market updates'],
        ['Sports', 'sports', 'Sports news and events'],
        ['Entertainment', 'entertainment', 'Entertainment and celebrity news'],
        ['Health', 'health', 'Health and wellness news']
      ];

      for (const [name, slug, desc] of categories) {
        await client.query(
          'INSERT INTO categories (name, slug, description, is_active) VALUES ($1, $2, $3, TRUE)',
          [name, slug, desc]
        );
      }
      console.log('✓ Default categories created (5 categories)');
    }

    // Check if default social media exists
    const socialResult = await client.query('SELECT COUNT(*) as count FROM social_media');
    if (parseInt(socialResult.rows[0].count) === 0) {
      const socialMedia = [
        ['Twitter', 'https://twitter.com', 'Twitter', 1],
        ['Facebook', 'https://facebook.com', 'Facebook', 2],
        ['LinkedIn', 'https://linkedin.com', 'Linkedin', 3]
      ];

      for (const [name, url, icon, order] of socialMedia) {
        await client.query(
          'INSERT INTO social_media (platform_name, url, icon_name, display_order, is_active) VALUES ($1, $2, $3, $4, TRUE)',
          [name, url, icon, order]
        );
      }
      console.log('✓ Default social media links created');
    }

    console.log('✓ Database tables initialized successfully');
    client.release();
  } catch (error) {
    console.error('✗ Database initialization error:', error.message);
  }
}

// Test connection and initialize database
pool.connect()
  .then(client => {
    console.log('✓ PostgreSQL Database Connected Successfully');
    client.release();
    initializeDatabase();
  })
  .catch(err => {
    console.error('✗ Database Connection Failed:', err.message);
    console.error('  Details:', err.code, '-', err.errno);
    // Don't exit immediately - allow graceful shutdown
    setTimeout(() => process.exit(1), 2000);
  });

export default pool;
