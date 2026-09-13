import fs from 'fs';

let contextTs = fs.readFileSync('src/context/RealtimeContext.tsx', 'utf8');

const notifCase = `
      case 'REALTIME_NOTIFICATION':
        if (message) addToast(data.title || 'Notification', message, 'INFO');
        break;
`;

if (!contextTs.includes("case 'REALTIME_NOTIFICATION':")) {
  contextTs = contextTs.replace(
    "case 'WORKER_LOCATION_UPDATED':",
    notifCase + "\n      case 'WORKER_LOCATION_UPDATED':"
  );
  fs.writeFileSync('src/context/RealtimeContext.tsx', contextTs);
  console.log('Patched RealtimeContext.tsx');
}
