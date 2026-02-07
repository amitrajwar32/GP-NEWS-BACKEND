const https = require('https');

// Configuration
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// For Render deployment: Use RENDER_EXTERNAL_URL if available
// For local: Use APP_URL or RENDER_EXTERNAL_URL manually set in .env
const APP_URL = process.env.RENDER_EXTERNAL_URL || 
                process.env.APP_URL || 
                'https://YOUR-APP.onrender.com';

const PING_ENDPOINT = `${APP_URL}/api/categories`; // Light endpoint that doesn't require auth

console.log(`🔄 Keep-Alive Service Started`);
console.log(`📍 Environment: ${process.env.RENDER ? 'RENDER PRODUCTION' : 'LOCAL/DEVELOPMENT'}`);
console.log(`📍 Pinging: ${PING_ENDPOINT}`);
console.log(`⏰ Interval: Every ${PING_INTERVAL / 1000 / 60} minutes\n`);

/**
 * Send a ping request to the deployed app
 */
function ping() {
  const url = new URL(PING_ENDPOINT);
  
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method: 'GET',
    timeout: 10000, // 10 second timeout
    headers: {
      'User-Agent': 'GN-News-KeepAlive/1.0'
    }
  };

  https.request(options, (res) => {
    const timestamp = new Date().toISOString();
    if (res.statusCode === 200 || res.statusCode === 304) {
      console.log(`✅ Ping success [${timestamp}] - Status: ${res.statusCode}`);
    } else {
      console.log(`⚠️  Ping received non-200 response [${timestamp}] - Status: ${res.statusCode}`);
    }
  })
  .on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ Ping failed [${timestamp}] - Error: ${error.message}`);
  })
  .on('timeout', () => {
    const timestamp = new Date().toISOString();
    console.error(`⏱️  Ping timeout [${timestamp}] - Request took too long`);
  })
  .end();
}

// Initial ping after 2 seconds
setTimeout(ping, 2000);

// Set up recurring pings every 5 minutes
setInterval(ping, PING_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-Alive Service Stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Keep-Alive Service Stopped');
  process.exit(0);
});
