// In src/Utils/NotificationUtils.js
const Notification = require("../Models/Notification");

const createNotification = async (userId, title, message, data = {}) => {
  console.log(`[NotificationUtils] Creating notification for user ${userId}`);
  console.log(`[NotificationUtils] Title: ${title}, Message: ${message}`);

  try {
    const notification = new Notification({
      userId,
      title,
      message,
      data, // Store additional data like shopId, userId for navigation
      read: false,
    });

    console.log(
      "[NotificationUtils] Notification object created:",
      notification
    );
    await notification.save();
    console.log("[NotificationUtils] Notification saved successfully");
    return notification;
  } catch (error) {
    console.error("[NotificationUtils] Error creating notification:", error);
    return null;
  }
};

module.exports = { createNotification };
