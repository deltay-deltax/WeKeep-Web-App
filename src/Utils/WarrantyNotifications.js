console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);

const nodemailer = require("nodemailer");
const moment = require("moment");
const twilio = require("twilio");
const AddWarranty = require("../Models/AddWarranty");

// Configure services
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Notification intervals in days
const NOTIFICATION_INTERVALS = [60, 30, 15, 3];

async function sendSMSNotification(warranty, daysRemaining, expirationDate) {
  try {
    const message = await twilioClient.messages.create({
      body: `WeKeep Alert: Your ${warranty.modelName} (${warranty.modelNumber}) warranty expires in ${daysRemaining} days (${expirationDate}).`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: warranty.phoneNumber,
    });
    console.log(`SMS sent to ${warranty.phoneNumber}: ${message.sid}`);
  } catch (error) {
    console.error(`SMS failed for ${warranty.phoneNumber}:`, error.message);
  }
}

async function checkAndSendWarrantyNotifications() {
  try {
    console.log("Checking for warranty expirations...");
    const today = moment().startOf("day");
    const warranties = await AddWarranty.find({});

    console.log(`Found ${warranties.length} warranties to check`);

    for (const warranty of warranties) {
      const purchaseDate = moment(warranty.purchaseDate);
      const expirationDate = purchaseDate.clone().add(1, "year");
      const daysUntilExpiration = expirationDate.diff(today, "days");

      if (NOTIFICATION_INTERVALS.includes(daysUntilExpiration)) {
        const alreadySent = warranty.notificationsSent?.some(
          (n) => n.interval === daysUntilExpiration
        );

        if (!alreadySent) {
          // Send email
          await sendExpirationEmail(
            warranty,
            daysUntilExpiration,
            expirationDate.format("YYYY-MM-DD")
          );

          // Send SMS
          await sendSMSNotification(
            warranty,
            daysUntilExpiration,
            expirationDate.format("MMMM D, YYYY")
          );

          // Update record
          await AddWarranty.findByIdAndUpdate(warranty._id, {
            $push: {
              notificationsSent: {
                interval: daysUntilExpiration,
                sentDate: new Date(),
              },
            },
          });

          console.log(`Processed notifications for ${warranty.modelNumber}`);
        }
      }
    }
    console.log("Warranty notification check completed");
  } catch (error) {
    console.error("Error checking warranty notifications:", error);
  }
}

async function sendExpirationEmail(warranty, daysRemaining, expirationDate) {
  if (!warranty.userEmail) {
    console.log(`No email for warranty ${warranty._id}`);
    return;
  }

  const timeMessage =
    {
      60: "2 months",
      30: "1 month",
      15: "15 days",
      3: "3 days",
    }[daysRemaining] || `${daysRemaining} days`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: warranty.userEmail,
      subject: `Warranty Expiration Notice: Your ${warranty.modelName} warranty expires in ${timeMessage}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #333; text-align: center;">Warranty Expiration Notice</h2>
        
        <p>Dear WeKeep User,</p>
        
        <p>This is a friendly reminder that your warranty for the following product will expire in <strong>${timeMessage}</strong>:</p>
        
        <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Product:</strong> ${warranty.modelName}</p>
          <p><strong>Model Number:</strong> ${warranty.modelNumber}</p>
          <p><strong>Company:</strong> ${warranty.company}</p>
          <p><strong>Purchase Date:</strong> ${moment(
            warranty.purchaseDate
          ).format("MMMM D, YYYY")}</p>
          <p><strong>Warranty Expiration:</strong> ${moment(
            expirationDate
          ).format("MMMM D, YYYY")}</p>
        </div>
        
        <p>If you need to extend your warranty or arrange for service before it expires, please contact the manufacturer.</p>
        
        <p>Thank you for using WeKeep to manage your product warranties!</p>
        
        <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
          This is an automated message from WeKeep. Please do not reply to this email.
        </p>
      </div>
    `,
    });
    console.log(`Email sent to ${warranty.userEmail}`);
  } catch (error) {
    console.error(`Email failed for ${warranty.userEmail}:`, error.message);
  }
}

module.exports = {
  checkAndSendWarrantyNotifications,
};
