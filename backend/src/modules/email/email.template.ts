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
