import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, MessageCircleMore, X, Mail } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, cartCount } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  message: ''
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const enquiryData = {
        ...formData,
        cartItems: cartItems.map(item => ({
          title: item.title,
          quantity: item.quantity || 1,
          image: item.images?.[0] ? 
            (item.images[0].includes('http') ? item.images[0] : `https://shlokainternational-2.onrender.com/uploads/products/${item.images[0]}`) 
            : 'No image',
          productId: item._id
        }))
      };

      const response = await axios.post('https://shlokainternational-2.onrender.com/api/enquiry', enquiryData);
      
      setSubmitStatus({ 
        success: true, 
        message: response.data.message || 'Your enquiry has been sent successfully! We will contact you soon.' 
      });
      
      // Reset form after successful submission
      setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      message: ''
    });
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus({ success: false, message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error sending enquiry:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.message || 'Failed to send enquiry. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnquiry = () => {
    // Create message without prices
    const itemsList = cartItems
      .map(
        (item) =>
          `${item.title} (Qty: ${item.quantity || 1})`
      )
      .join('%0A- ');

    const message = `Hi, I would like to enquire about these products:%0A%0A- ${itemsList}%0A%0APlease provide more details.`;

    // Your WhatsApp number (with country code, no +)
    const phoneNumber = '919619279818';

    // Open WhatsApp with message
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-24 relative">
      {/* Email Enquiry Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-indigo-300">

      {/* Modal Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-indigo-700">
        <h2 className="text-2xl font-semibold text-white">Email Enquiry</h2>
        <button 
          onClick={() => {
            setIsModalOpen(false);
            setSubmitStatus({ success: false, message: '' });
          }}
          className="text-white hover:text-gray-300"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {submitStatus.message ? (
        <div className="p-4 bg-green-100 text-center text-green-800 text-lg font-medium">
          {submitStatus.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[75vh]">

          {/* LEFT – SELECTED PRODUCTS */}
          <div className="p-5 border-r bg-gray-50 overflow-y-auto">
            <h3 className="font-semibold text-xl mb-4 text-gray-800">Selected Products</h3>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow">
                  <img
                    src={
                      item.images?.[0]
                        ? item.images[0].includes("http")
                          ? item.images[0]
                          : `https://shlokainternational-2.onrender.com/uploads/products/${item.images[0]}`
                        : "https://via.placeholder.com/50"
                    }
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – FORM */}
          <div className="p-6 overflow-y-auto bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-medium text-gray-700">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input h-24"
                  placeholder="Any additional details..."
                ></textarea>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      <Mail className="w-4 h-4 mr-2" /> Send Enquiry
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      )}
    </div>
  </div>
)}

      <div className="container mx-auto px-3 sm:px-4 py-2">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-indigo-700">
          Your Cart
        </h1>
        </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link
            to="/categories"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border bg-white shadow-sm rounded-lg"
            >
              <div className="flex items-center">
               <img
                src={
                  item.images?.[0]
                    ? item.images[0].includes('http')
                      ? item.images[0]                 // full URL
                      : `https://shlokainternational-2.onrender.com/uploads/products/${item.images[0]}` // filename → URL
                    : 'https://via.placeholder.com/100'
                }
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />

                <div className="ml-4">
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity || 1}</p>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-full"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}

          {/* SHOW TOTAL PRODUCTS + WHATSAPP ENQUIRY */}
          <div className="border-t pt-6 mt-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Total Products: {cartCount}
                </h2>
              </div>

              <div className="flex space-x-4 justify-between">
              <Link
                to="/categories"
                className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>

              {/* WhatsApp Enquiry */}
              <button
                onClick={handleEnquiry}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <MessageCircleMore className="text-white w-5 h-5 mr-2" />
                      Enquiry on Whatsapp
              </button>

              {/* Email Enquiry */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2 text-white" />
                Email Enquiry
              </button>
            </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
