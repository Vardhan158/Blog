const Notification = require("../models/Notification");
const { emitToUser } = require("../socket");

const createNotification = async ({ recipient, actor, blog, type, message }) => {
  if (!recipient || !type || !message) return null;

  if (actor && recipient.toString() === actor.toString() && type !== "post") {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    actor,
    blog,
    type,
    message,
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate("actor", "name username avatar")
    .populate("blog", "title");

  emitToUser(recipient, "notification:new", populatedNotification);
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

  populatedNotifications.forEach((notification) => {
    emitToUser(notification.recipient, "notification:new", notification);
  });

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
