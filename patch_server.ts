import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf8');

const notifFunction = `
function sendSimulatedNotification(target: 'CUSTOMER' | 'WORKER', user: any, title: string, message: string) {
  const methods = ['📱 SMS'];
  if (target === 'CUSTOMER' || (target === 'WORKER' && user.emailVerified)) {
    methods.push('📧 Email');
  }

  const methodString = methods.join(' & ');
  const detail = \`[\${target}] Sent via \${methodString} to \${user.name || user.id}: \${message}\`;
  
  console.log(\`[NOTIFICATION] \${detail}\`);
  
  broadcast('REALTIME_NOTIFICATION', { target, user, title, message, methods }, detail);
}
`;

// Insert the notification function after broadcast function
serverTs = serverTs.replace('function broadcast(event: string, data: any, message?: string) {', notifFunction + '\nfunction broadcast(event: string, data: any, message?: string) {');

// 1. Booking Accepted
serverTs = serverTs.replace(
  "broadcast('WORKER_ACCEPTED', booking, `Worker ${booking.workerName} accepted Booking ${booking.id}!`);",
  `broadcast('WORKER_ACCEPTED', booking, \`Worker \${booking.workerName} accepted Booking \${booking.id}!\`);
  
  const customer1 = customers.find(c => c.id === booking.customerId) || PRIMARY_DEMO_CUSTOMER;
  const worker1 = workers.find(w => w.id === booking.workerId) || workers[0];
  
  sendSimulatedNotification('CUSTOMER', customer1, 'Booking Confirmed', \`Your booking \${booking.id} has been accepted by \${worker1.name}.\`);
  sendSimulatedNotification('WORKER', worker1, 'New Job Assigned', \`You have been assigned booking \${booking.id} for \${customer1.name}.\`);`
);

// 2. Worker on the way (start-journey)
serverTs = serverTs.replace(
  "broadcast('WORKER_ON_THE_WAY', booking, `Worker ${booking.workerName} is on the way! ETA: ${booking.workerLocation?.etaMinutes || 10} mins.`);",
  `broadcast('WORKER_ON_THE_WAY', booking, \`Worker \${booking.workerName} is on the way! ETA: \${booking.workerLocation?.etaMinutes || 10} mins.\`);
  
  const customer2 = customers.find(c => c.id === booking.customerId) || PRIMARY_DEMO_CUSTOMER;
  const worker2 = workers.find(w => w.id === booking.workerId) || workers[0];
  
  sendSimulatedNotification('CUSTOMER', customer2, 'Worker On The Way', \`\${worker2.name} is on the way! ETA: \${booking.workerLocation?.etaMinutes || 10} mins.\`);
  sendSimulatedNotification('WORKER', worker2, 'Journey Started', \`Journey started. ETA to customer: \${booking.workerLocation?.etaMinutes || 10} mins.\`);`
);

// 3. Worker arrived
serverTs = serverTs.replace(
  "broadcast('WORKER_ARRIVED', booking, `Worker ${booking.workerName} has arrived at customer premises!`);",
  `broadcast('WORKER_ARRIVED', booking, \`Worker \${booking.workerName} has arrived at customer premises!\`);
  
  const customer3 = customers.find(c => c.id === booking.customerId) || PRIMARY_DEMO_CUSTOMER;
  const worker3 = workers.find(w => w.id === booking.workerId) || workers[0];
  
  const timeTakenMinutes = booking.acceptedAt ? Math.max(1, Math.round((Date.now() - new Date(booking.acceptedAt).getTime()) / 60000)) : 10;
  
  sendSimulatedNotification('CUSTOMER', customer3, 'Worker Arrived', \`\${worker3.name} has arrived at your location. Time taken: \${timeTakenMinutes} mins.\`);
  sendSimulatedNotification('WORKER', worker3, 'Arrived at Destination', \`You have arrived at the customer location. Time taken: \${timeTakenMinutes} mins.\`);`
);

fs.writeFileSync('server.ts', serverTs);
console.log('Patched server.ts with notifications logic.');
