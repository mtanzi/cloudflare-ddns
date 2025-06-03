import { DDNSService } from './services/ddnsService';

async function main() {
  const ddnsService = new DDNSService();

  try {
    await ddnsService.startLoop();
  } catch (error) {
    console.error('❌ Failed to start DDNS service:', error);
    process.exit(1);
  }
}

main();
