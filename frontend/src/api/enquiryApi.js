import API from './api';

export const submitEnquiry = async (enquiryData) => {
  try {
    const response = await API.post('/enquiry', enquiryData);
    return response.data;
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error.response?.data || { message: 'Failed to submit enquiry. Please try again.' };
  }
};
