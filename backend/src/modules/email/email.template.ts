export const bookingConfirmationTemplate = (
  customerName: string,
  serviceTitle: string,
  startTime: Date,
  meetingLink: string | null
) => {
  if (meetingLink) {
    return `<div style="font-family:Arial;padding:20px">
    <h2>Booking Confirmed</h2>

    <p>Hello <b>${customerName}</b>,</p>

    <p>Your booking for <b>${serviceTitle}</b> is confirmed.</p>

    <p>
      Date: ${startTime.toDateString()} <br/>
      Time: ${startTime.toLocaleTimeString()}
      Meeting Link: <a href="${meetingLink}">${meetingLink}</a>
    </p>

    <p>See you soon.</p>
  </div>`;
  } else {
    return `<div style="font-family:Arial;padding:20px">
    <h2>Booking Confirmed</h2>

    <p>Hello <b>${customerName}</b>,</p>

    <p>Your booking for <b>${serviceTitle}</b> is confirmed.</p>

    <p>
      Date: ${startTime.toDateString()} <br/>
      Time: ${startTime.toLocaleTimeString()}
    </p>

    <p>See you soon.</p>
  </div>`;
  }
};

export const bookingReminderTemplate = (
  customerName: string,
  serviceTitle: string,
  startTime: Date
) => {
  return `<div style="font-family:Arial;padding:20px">
    <h2>Reminder</h2>

    <p>Hello <b>${customerName}</b>,</p>

    <p>This is a reminder for your upcoming booking.</p>

    <p>
      Service: ${serviceTitle} <br/>
      Date: ${startTime.toDateString()} <br/>
      Time: ${startTime.toLocaleTimeString()}
    </p>
  </div>
  `;
};

export const bookingCancelledTemplate = (
  customerName: string,
  serviceTitle: string
) => {
  return `
  <div style="font-family:Arial;padding:20px">
    <h2>Booking Cancelled</h2>

    <p>Hello <b>${customerName}</b>,</p>

    <p>Your booking for <b>${serviceTitle}</b> has been cancelled.</p>

  </div>
  `;
};

export const resetPasswordEmailTemplate = (
  customerName: string,
  resetLink: string
): string => {
  return `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Reset Your Password</h2>
    <p>Hi ${customerName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password. This link is valid for <strong>10 minutes</strong>.</p>
    <a href="${resetLink}" 
       style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
      Reset Password
    </a>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p style="color: #6B7280; font-size: 14px;">This link expires in 10 minutes.</p>
  </div>
  `;
};
