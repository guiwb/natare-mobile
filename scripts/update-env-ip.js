const os = require('os');
const fs = require('fs');
const path = require('path');

const VIRTUAL_IFACE = /^(lo|docker|br-|veth|virbr|tun|tap|vmnet|vboxnet|utun|llw|awdl)/i;

function isDockerRange(ip) {
  const match = ip.match(/^172\.(\d+)\./);
  return match && Number(match[1]) >= 16 && Number(match[1]) <= 31;
}

function rank(ip) {
  if (ip.startsWith('192.168.')) return 0;
  if (ip.startsWith('10.')) return 1;
  if (isDockerRange(ip)) return 3;
  return 2;
}

const interfaces = os.networkInterfaces();
const candidates = [];

for (const [name, ifaces] of Object.entries(interfaces)) {
  if (VIRTUAL_IFACE.test(name)) continue;

  for (const iface of ifaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      candidates.push(iface.address);
    }
  }
}

candidates.sort((a, b) => rank(a) - rank(b));
const localIp = candidates[0] || '127.0.0.1';

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
