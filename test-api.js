#!/usr/bin/env node
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function test() {
  console.log('🧪 Starting API Tests...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    let res = await fetch(`${BASE_URL}/health`);
    let data = await res.json();
    console.log('✅ Health:', data.status === 'OK' ? 'PASS' : 'FAIL');
    console.log('   Response:', JSON.stringify(data, null, 2));
    
    // Test 2: Login
    console.log('\n2️⃣  Testing Login...');
    res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gnewsportal.com', password: 'admin123' })
    });
    data = await res.json();
    console.log('✅ Login:', data.success && data.data?.token ? 'PASS' : 'FAIL');
    console.log('   Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data?.token) {
      const token = data.data.token;
      
      // Test 3: Get Categories
      console.log('\n3️⃣  Testing Get Categories...');
      res = await fetch(`${BASE_URL}/categories`);
      data = await res.json();
      console.log('✅ Categories:', Array.isArray(data.data) ? 'PASS' : 'FAIL');
      console.log('   Found:', data.data?.length || 0, 'categories');
      
      // Test 4: Get News
      console.log('\n4️⃣  Testing Get News...');
      res = await fetch(`${BASE_URL}/news`);
      data = await res.json();
      console.log('✅ News:', data.data?.items ? 'PASS' : 'FAIL');
      console.log('   Found:', data.data?.items?.length || 0, 'news articles');
      
      // Test 5: Create News
      console.log('\n5️⃣  Testing Create News...');
      res = await fetch(`${BASE_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test News ' + Date.now(),
          summary: 'Test summary',
          content: 'Test content',
          categoryId: 1,
          thumbnail: null,
          status: 'published'
        })
      });
      data = await res.json();
      console.log('✅ Create News:', data.success && data.data?.id ? 'PASS' : 'FAIL');
      if (data.error || !data.success) {
        console.log('   Error:', data.message);
      }
      if (data.data?.slug) {
        console.log('   Slug:', data.data.slug);
      }
    }
    
    console.log('\n✨ All tests completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
