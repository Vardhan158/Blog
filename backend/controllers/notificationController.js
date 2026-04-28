const Notification = require("../models/Notification");
const { emitToUser } = require("../socket");
const { sendPushNotification } = require("../utils/webPush");

const deliverNotification = async (notification) => {
  emitToUser(notification.recipient, "notification:new", notification);
  await sendPushNotification(notification.recipient, {
    title: "BlogPage",
    body: notification.message,
    url: notification.blog?._id ? `/article/${notification.blog._id}` : "/dashboard",
    notificationId: notification._id?.toString(),
  });
};

const createNotification = async ({ recipient, actor, blog, type, message }) => {
  if (!recipient || !type || !message) return null;

  if (actor && recipient.toString() === actor.toString() && type !== "post") {
    return null;
  }

  let notification;

  if (type === "like" && actor && blog) {
    notification = await Notification.findOneAndUpdate(
      {
        recipient,
        actor,
        blog,
        type,
      },
      {
        $set: {
          message,
          read: false,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  } else {
    notification = await Notification.create({
      recipient,
      actor,
      blog,
      type,
      message,
    });
  }

  const populatedNotification = await Notification.findById(notification._id)
    .populate("actor", "name username avatar")
    .populate("blog", "title");

  await deliverNotification(populatedNotification);
  return populatedNotification;
};

const createNotificationsForRecipients = async ({ recipients, actor, blog, type, message }) => {
  if (!Array.isArray(recipients) || recipients.length === 0 || !type || !message) {
    return [];
  }

  const uniqueRecipients = [
    ...new Set(recipients.filter(Boolean).map((recipient) => recipient.toString())),
  ];

  if (uniqueRecipients.length === 0) return [];

  const notifications = await Notification.insertMany(
    uniqueRecipients.map((recipient) => ({
      recipient,
      actor,
      blog,
      type,
      message,
    }))
  );

  const populatedNotifications = await Notification.find({
    _id: { $in: notifications.map((notification) => notification._id) },
  })
    .populate("actor", "name username avatar")
    .populate("blog", "title");

  await Promise.all(
    populatedNotifications.map((notification) => deliverNotification(notification))
  );

  return populatedNotifications;
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("actor", "name username avatar")
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((item) => !item.read).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: err.message,
    });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, message: "Notifications marked as read" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: err.message,
    });
  }
};

module.exports = {
  createNotification,
  createNotificationsForRecipients,
  getNotifications,
  markNotificationsRead,
};
