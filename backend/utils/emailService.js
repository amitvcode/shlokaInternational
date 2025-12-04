import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // Replace with your SMTP host
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});

export const sendEnquiryEmail = async (enquiryData) => {
  try {
    // Format the cart items for the email
    const cartItemsHtml = enquiryData.cartItems.map(item => `
      <div style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">
        <div>
          <h3 style="margin: 0 0 5px 0;">${item.title}</h3>
          <p style="margin: 0;">Quantity: ${item.quantity}</p>
        </div>
        <div style="clear: both;"></div>
      </div>
    `).join('');

    // Email options
      const mailOptions = {
      from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
      to: process.env.COMPANY_EMAIL,
      subject: `New Enquiry from ${enquiryData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Enquiry Received</h2>
          <p><strong>Name:</strong> ${enquiryData.name}</p>
          <p><strong>Email:</strong> ${enquiryData.email}</p>
          <p><strong>Phone:</strong> ${enquiryData.phone}</p>
          <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #4f46e5;">Shipping Address:</h3>
            <p>${enquiryData.address}<br>
            ${enquiryData.city}, ${enquiryData.state}<br>
            Pincode: ${enquiryData.pincode}, ${enquiryData.country}</p>
          </div>
          <p><strong>Message:</strong> ${enquiryData.message || 'No additional message'}</p>
          <h3 style="color: #4f46e5; margin-top: 20px;">Requested Items:</h3>
          ${cartItemsHtml}
        </div>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendConfirmationEmail = async (toEmail, name) => {
  try {
    const mailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Your Company'}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Thank You for Your Enquiry',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4f46e5;">Thank You for Your Enquiry, ${name}!</h2>
          
          <p>We have received your product enquiry and our team will get back to you as soon as possible.</p>
          
          <p>Here's a summary of your enquiry:</p>
          <ul>
            <li>Name: ${name}</li>
            <li>Email: ${toEmail}</li>
            <li>We'll get back to you within 24-48 hours.</li>
          </ul>
          
          <p>If you have any urgent questions, please don't hesitate to contact us at ${process.env.COMPANY_EMAIL || 'our support email'}.</p>
          
          <p>Best regards,<br>${process.env.COMPANY_NAME || 'Your Company'}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error for confirmation email failure
  }
};
