const webpush = require('web-push');

// Using a generic contact email for VAPID requirements
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@dayscholar-os.edu.in';

try {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      vapidEmail,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  } else {
    console.warn('VAPID keys not found in .env. Push notifications are disabled.');
  }
} catch (error) {
  console.error('Failed to configure web-push:', error.message);
}

exports.sendNotification = async (subscription, payload) => {
  if (!subscription || !process.env.VAPID_PUBLIC_KEY) return;
  
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log('Push notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification', error);
  }
};
