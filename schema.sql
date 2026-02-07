-- PostgreSQL Database Schema for News Portal CMS

CREATE DATABASE gn_news_portal;

\c gn_news_portal;

-- Admins Table
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON admins(username);
CREATE INDEX idx_email ON admins(email);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_slug ON categories(slug);
CREATE INDEX idx_name ON categories(name);

-- News Table
CREATE TABLE news (
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

CREATE INDEX idx_slug_news ON news(slug);
CREATE INDEX idx_category ON news(category_id);
CREATE INDEX idx_status ON news(status);
CREATE INDEX idx_created_at ON news(created_at);
CREATE INDEX idx_title ON news(title);

-- Contacts Table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_contact ON contacts(email);
CREATE INDEX idx_created_at_contact ON contacts(created_at);

-- Social Media Table
CREATE TABLE social_media (
  id SERIAL PRIMARY KEY,
  platform_name VARCHAR(50) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  icon_name VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_platform ON social_media(platform_name);
CREATE INDEX idx_display_order ON social_media(display_order);

-- Site Settings Table
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_setting_key ON site_settings(setting_key);

-- Insert default social media links
INSERT INTO social_media (platform_name, url, icon_name, display_order, is_active) VALUES
('Twitter', 'https://twitter.com', 'Twitter', 1, TRUE),
('Facebook', 'https://facebook.com', 'Facebook', 2, TRUE),
('LinkedIn', 'https://linkedin.com', 'Linkedin', 3, TRUE);

-- Insert default admin (password: admin123 - bcrypt hash)
INSERT INTO admins (username, email, password, is_active) 
VALUES ('admin', 'admin@gnewsportal.com', '$2a$10$YIjlrTxGJb1tEIkBGBwJqOKkv5nSvfL/1wfP8wYrJJvqJ7FLwBJX.', TRUE);

-- Insert default categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Technology', 'technology', 'Latest technology news and updates', TRUE),
('Business', 'business', 'Business news and market updates', TRUE),
('Sports', 'sports', 'Sports news and events', TRUE),
('Entertainment', 'entertainment', 'Entertainment and celebrity news', TRUE),
('Health', 'health', 'Health and wellness news', TRUE);
