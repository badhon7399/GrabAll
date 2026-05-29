import readline from 'readline';
import https from 'https';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function setupBetterStack(token: string, url: string) {
  const data = JSON.stringify({
    monitor_type: 'status',
    url: url,
    pronounceable_name: 'GrabAll Goods API Health',
    check_frequency: 300 // 5 minutes in seconds
  });

  const options = {
    hostname: 'uptime.betterstack.com',
    port: 443,
    path: '/api/v2/monitors',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise<void>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          console.log('\n✅ Better Stack Monitor created successfully!');
          try {
            const parsed = JSON.parse(body);
            console.log(`🔗 Monitor ID: ${parsed.data.id}`);
            console.log(`🔗 URL Monitored: ${parsed.data.attributes.url}`);
          } catch {
            console.log(body);
          }
          resolve();
        } else {
          console.error(`\n❌ Failed to create monitor. Status Code: ${res.statusCode}`);
          console.error(`Response: ${body}`);
          reject(new Error(body));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`\n❌ Request Error: ${e.message}`);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function setupUptimeRobot(token: string, url: string) {
  const data = JSON.stringify({
    name: 'GrabAll Goods API Health',
    type: 'HTTP',
    url: url,
    interval: 300 // 5 minutes in seconds
  });

  const options = {
    hostname: 'api.uptimerobot.com',
    port: 443,
    path: '/v3/monitors',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise<void>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          console.log('\n✅ UptimeRobot Monitor created successfully!');
          try {
            const parsed = JSON.parse(body);
            console.log(`🔗 Monitor ID: ${parsed.id}`);
          } catch {
            console.log(body);
          }
          resolve();
        } else {
          console.error(`\n❌ Failed to create monitor. Status Code: ${res.statusCode}`);
          console.error(`Response: ${body}`);
          reject(new Error(body));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`\n❌ Request Error: ${e.message}`);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('----------------------------------------------------');
  console.log('🚀 GrabAll Goods - Uptime Monitoring Automator');
  console.log('----------------------------------------------------');

  console.log('\nSelect Monitoring Provider:');
  console.log('1. Better Stack (Recommended)');
  console.log('2. UptimeRobot');
  
  const choice = await askQuestion('\nEnter choice (1 or 2): ');
  if (choice !== '1' && choice !== '2') {
    console.log('Invalid choice. Exiting.');
    rl.close();
    return;
  }

  const rawUrl = await askQuestion('\nEnter your production backend API health URL (e.g., https://api.graballgoods.com/api/health): ');
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    console.log('❌ Invalid URL. URL must start with http:// or https://');
    rl.close();
    return;
  }

  if (rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1') || rawUrl.includes('192.168.')) {
    console.log('\n⚠️  WARNING: You entered a local URL. UptimeRobot/Better Stack cannot ping local services directly.');
    const proceed = await askQuestion('Do you want to proceed anyway (e.g. testing via ngrok tunnel)? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }

  const token = await askQuestion('\nEnter your Provider API Token / Authorization Key: ');
  if (!token.trim()) {
    console.log('❌ API Token cannot be empty.');
    rl.close();
    return;
  }

  console.log('\nCreating monitor, please wait...');

  try {
    if (choice === '1') {
      await setupBetterStack(token, rawUrl);
    } else {
      await setupUptimeRobot(token, rawUrl);
    }
  } catch (err) {
    // Errors printed in functions
  } finally {
    rl.close();
  }
}

main();
