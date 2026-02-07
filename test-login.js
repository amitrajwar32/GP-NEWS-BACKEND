#!/usr/bin/env node
import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('Testing login with admin@gnewsportal.com/admin123...\n');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gnewsportal.com', password: 'admin123' })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data?.token) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('Token:', data.data.token.substring(0, 50) + '...');
      console.log('Admin ID:', data.data.admin.id);
    } else {
      console.log('\n❌ LOGIN FAILED!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testLogin();
