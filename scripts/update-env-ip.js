const os = require('os');
const fs = require('fs');
const path = require('path');

const interfaces = os.networkInterfaces();
let localIp = '127.0.0.1';

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIp = iface.address;
      break;
    }
  }
  if (localIp !== '127.0.0.1') break;
}

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(
    /(EXPO_PUBLIC_API_URL=https?:\/\/)[^\s:/]+(:\d+)?/g,
    (match, prefix, port) => {
      return `${prefix}${localIp}${port || ''}`;
    },
  );
  fs.writeFileSync(envPath, envContent);
  console.log(`[Script] .env atualizado com o IP local: ${localIp}`);
} else {
  fs.writeFileSync(envPath, `EXPO_PUBLIC_API_URL=http://${localIp}\n`);
  console.log(`[Script] .env criado com o IP local: ${localIp}`);
}
