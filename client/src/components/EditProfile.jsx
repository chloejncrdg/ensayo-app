import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ currentUser, isOpen, onClose, onSave }) => {

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  const initialFormData = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    username: currentUser.username,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: currentUser.email,
  };

  const [activeTab, setActiveTab] = useState('editProfile'); // Default active tab
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearErrors(); // Clear any existing errors when switching tabs
  };

  const clearErrors = () => {
    setErrors({
      firstName: '',
      lastName: '',
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      email: '',
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    clearErrors();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    // Input validation for first name and last name
    if (!/^[a-zA-Z .-]{1,50}$/.test(formData.firstName)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: 'First name can only contain letters, periods, spaces, and dashes, and be up to 50 characters.',
      }));
      return;
    }
    if (!/^[a-zA-Z .-]{1,50}$/.test(formData.lastName)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: 'Last name can only contain letters, periods, spaces, and dashes, and be up to 50 characters.',
      }));
      return;
    }
   
    try {
        const response = await axiosInstance.put(`/users/${currentUser._id}`, { firstName: formData.firstName, lastName: formData.lastName });
        onSave(response.data);
      } catch (error) {
        console.error('Error updating names:', error);
      }
    
  };

  const handleEditUsernameSubmit = async (e) => {
    e.preventDefault();
    // Input validation for username
    if (formData.username.length > 15) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: 'Username must be 15 characters or less.',
      }));
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: 'Username must only contain letters, numbers, and underscore (_).',
      }));
      return;
    }
    // Submit logic for editing username
    try {
      const response = await axiosInstance.put(`/users/${currentUser._id}/username`, { username: formData.username });
      onSave(response.data);
    } catch (error) {
    //   console.error('Error updating username:', error);
      if (error.response && error.response.status === 400 && error.response.data.error === 'Username is already taken.') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: 'Username already exists.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: 'Error updating username. Please try again.',
        }));
      }
    }
  };


  
// to display errors one at a time
const handleEditPasswordSubmit = async (e) => {
    e.preventDefault();
    // Clear previous errors
    clearErrors();
  
    // Input validation for password
    if (!formData.currentPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: 'Current password is required.',
      }));
      return;
    }
    
    if (!formData.newPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: 'New password is required.',
      }));
      return;
    }
    
    if (!formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Confirm password is required.',
      }));
      return;
    }
  
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match.',
      }));
      return;
    }
    
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/.test(formData.newPassword)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: 'Password must have at least 8 characters, including at least one digit, one lowercase letter, one uppercase letter, and one special character.',
      }));
      return;
    }
  
    try {
      const response = await axiosInstance.put(`/users/${currentUser._id}/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      // Reset form state after successful password change
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      clearErrors(); // Clear any previous password-related errors
  
      onSave(response.data);
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response && error.response.status === 400 && error.response.data.error === 'Current password is wrong') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          currentPassword: 'Current password is wrong.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          currentPassword: 'Error updating password. Please try again.',
        }));
      }
    }
  };
  
  

  const handleEditEmailSubmit = async (e) => {
    e.preventDefault();
    // Input validation for email
    if (!formData.email || formData.email === currentUser.email) {
      return; // No changes or already existing email, no action needed
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Invalid email format.',
      }));
      return;
    }
    // Submit logic for editing email
    try {
      const response = await axiosInstance.put(`/users/${currentUser._id}/email`, { email: formData.email });
      onSave(response.data);
    } catch (error) {
    //   console.error('Error updating email:', error);
      if (error.response && error.response.status === 400 && error.response.data.error === 'User with this email already exists.') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'User with this email already exists.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Error updating email. Please try again.',
        }));
      }
    }
  };

  const isSaveDisabled = () => {
    switch (activeTab) {
      case 'editProfile':
        return (
            formData.firstName === initialFormData.firstName &&
            formData.lastName === initialFormData.lastName
        );
      case 'editUsername':
        return formData.username === currentUser.username; // Disable save if username hasn't changed
      case 'editPassword':
        return (
              formData.currentPassword === '' &&
              formData.newPassword === '' &&
              formData.confirmPassword === ''
        );
      case 'editEmail':
        return formData.email === currentUser.email; // Disable save if email hasn't changed
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full flex"> {/* Added flex class */}
        {/* Left side with tabs */}
        <div className="w-1/4 pr-4 font-sf-regular">
        <h2 className="text-2xl font-bold mb-4">Edit Account</h2>
        <ul className="flex flex-col"> {/* Vertical flex column for tabs */}
            <li className={`mb-4 cursor-pointer text-center ${activeTab === 'editProfile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`} onClick={() => handleTabChange('editProfile')}>
            Edit Profile
            </li>
            <li className={`mb-4 cursor-pointer text-center ${activeTab === 'editUsername' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`} onClick={() => handleTabChange('editUsername')}>
            Edit Username
            </li>
            <li className={`mb-4 cursor-pointer text-center ${activeTab === 'editPassword' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`} onClick={() => handleTabChange('editPassword')}>
            Edit Password
            </li>
            <li className={`cursor-pointer text-center ${activeTab === 'editEmail' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`} onClick={() => handleTabChange('editEmail')}>
            Update Email
            </li>
        </ul>
        </div>

    <div className="w-0.5 bg-gray-300"></div>
    
    {/* Right side with forms */}
    <div className="w-3/4 pl-4 font-sf-regular">
      {activeTab === 'editProfile' && (
        <form onSubmit={handleEditProfileSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.firstName && <p className="text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.lastName && <p className="text-red-500 mt-1">{errors.lastName}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`text-white py-2 px-4 rounded-md ${isSaveDisabled() ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isSaveDisabled()}
            >
              Save
            </button>
          </div>
        </form>
      )}
      {activeTab === 'editUsername' && (
        <form onSubmit={handleEditUsernameSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.username && <p className="text-red-500 mt-1">{errors.username}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`text-white py-2 px-4 rounded-md ${isSaveDisabled() ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isSaveDisabled()}
            >
              Save
            </button>
          </div>
        </form>
      )}
      {activeTab === 'editPassword' && (
        <form onSubmit={handleEditPasswordSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.currentPassword && <p className="text-red-500 mt-1">{errors.currentPassword}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.newPassword && <p className="text-red-500 mt-1">{errors.newPassword}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`text-white py-2 px-4 rounded-md ${isSaveDisabled() ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isSaveDisabled()}
            >
              Save
            </button>
          </div>
        </form>
      )}
      {activeTab === 'editEmail' && (
        <form onSubmit={handleEditEmailSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`text-white py-2 px-4 rounded-md ${isSaveDisabled() ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isSaveDisabled()}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
</div>


  );
};

export default EditProfile;
