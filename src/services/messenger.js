import axios from 'axios';
import emailjs from 'emailjs-com';

export const sendSMS = async (phone, message) => {
  const accountSid = process.env.REACT_APP_TWILIO_SID;
  const authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.REACT_APP_TWILIO_PHONE;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const data = new URLSearchParams({
    From: fromPhone,
    To: phone,
    Body: message
  });

  try {
    const response = await axios.post(url, data, {
      auth: {
        username: accountSid,
        password: authToken
      }
    });
    return response.data;
  } catch (error) {
    console.error('Twilio SMS send error:', error);
    throw error;
  }
};

export const sendEmail = async (toEmail, message) => {
  const serviceID = process.env.REACT_APP_EMAIL_SERVICE_ID;
  const templateID = process.env.REACT_APP_EMAIL_TEMPLATE_ID;
  const userID = process.env.REACT_APP_EMAIL_USER_ID;

  try {
    const result = await emailjs.send(serviceID, templateID, {
      to_email: toEmail,
      message,
    }, userID);
    return result;
  } catch (error) {
    console.error('EmailJS send error:', error);
    throw error;
  }
};

export const sendReminder = async (appt, message) => {
  if (appt.channel === 'SMS' || appt.channel === 'WhatsApp') {
    return sendSMS(appt.phone, message);
  }
  if (appt.channel === 'Email') {
    return sendEmail(appt.email, message);
  }
};
