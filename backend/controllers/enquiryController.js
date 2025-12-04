import { sendEnquiryEmail, sendConfirmationEmail } from '../utils/emailService.js';

export const submitEnquiry = async (req, res) => {
  try {
const { name, email, phone, message, address, city, state, pincode, country, cartItems } = req.body;

    // Basic validation
    if (!name || !email || !phone || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, and at least one product in cart.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.'
      });
    }

    // Prepare enquiry data
    const enquiryData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
      address,    // Make sure these fields are included
      city : city.trim(),
      state : state.trim(),
      pincode : pincode.trim(),
      country : country.trim(),
      cartItems: cartItems.map(item => ({
        title: item.title,
        quantity: item.quantity || 1,
        productId: item.productId
      }))
    };

    // Send email to company
    await sendEnquiryEmail(enquiryData);
    
    // Send confirmation email to user
    await sendConfirmationEmail(enquiryData.email, enquiryData.name);

    res.status(200).json({
      success: true,
      message: 'Your enquiry has been submitted successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Error processing enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your enquiry. Please try again later.'
    });
  }
};
