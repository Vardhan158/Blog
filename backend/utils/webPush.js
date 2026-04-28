const webpush = require("web-push");
const User = require("../models/User");

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const contact = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

const isConfigured = Boolean(publicKey && privateKey);

if (isConfigured) {
  webpush.setVapidDetails(contact, publicKey, privateKey);
} else {
  console.warn("Web push is not configured. Missing VAPID keys.");
}

const sendPushNotification = async (recipientId, payload) => {
  if (!isConfigured || !recipientId) return;

  const user = await User.findById(recipientId).select("pushSubscriptions");
  const subscriptions = user?.pushSubscriptions || [];
  if (!subscriptions.length) return;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
      } catch (error) {
        const statusCode = error?.statusCode;
        const invalidSubscription = [400, 401, 403, 404, 410].includes(statusCode);

        if (invalidSubscription) {
          await User.updateOne(
            { _id: recipientId },
            { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
          );
          return;
        }

        console.error(
          "Push notification error:",
          statusCode || "unknown",
          error?.body || error?.message || error
        );
      }
    })
  );
};

module.exports = {
  publicVapidKey: publicKey || "",
  sendPushNotification,
};
