import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const id = queryParams.get('id');

    const axiosInstance = axios.create({
        baseURL:process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        if (!token || !id) {
            navigate('/404');
            return;
        }

        const verifyToken = async () => {
            try {
                await axiosInstance.post('/users/verify-token', { token, id });
            } catch (err) {
                setError('Error: Invalid or expired token.');
                setMessage('');
                navigate('/404'); // Redirect to 404 error page
            }
        };

        verifyToken();
    }, [token, id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !id) return;

        if (!newPassword || !confirmPassword) {
            setError('Please fill up all fields.');
            setMessage('');
            return;
        }
    

        if (newPassword !== confirmPassword) { // Check if passwords match
            setError('Passwords do not match.');
            setMessage('');
            return;
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[0-9a-zA-Z!@#$%^&*()-_+=]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError(
            'Invalid password'
            );
            return;
        }

        try {
            await axiosInstance.post('/users/reset-password', { token, id, newPassword });
            setMessage('Password reset successfully.');
            setError('');
            setIsModalOpen(true); // Open the modal on successful password reset
        } catch (err) {
            setError('Error resetting password. The link might be expired or invalid.');
            setMessage('');
        }
    };
    const Modal = ({ isOpen, message, onClose }) => {
        if (!isOpen) return null;
    
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto flex flex-col items-center">
                    <div className='h-40 w-40 flex justify-center items-center mb-12'>
                        <img className='object-contain' src='/check.png' alt='Check Symbol'/>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 text-center font-sf-bold">{message}</h2>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={onClose}
                            className="bg-white text-blue-800 font-sf-regular"
                        >
                            Go back to Login page
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate('/login'); // Redirect to login after closing the modal
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-20 px-4">
            <div className="w-full max-w-xl bg-white px-16 py-10 rounded-2xl shadow-custom-dark mb-32">
                <h2 className="text-3xl font-sf-bold text-blue-800 mb-3 text-center">Reset Password</h2>
                <p className="px-10 text-sm font-sf-regular text-blue-800 mb-6 text-center">
                    Enter a new password
                </p>
                <form>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-600 font-sf-regular mb-1">New Password</label>
                        <input
                         type="password"
                         id="newPassword"
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm h-10 font-sf-regular px-4"
                         required
                     />
                     <p className='font-sf-regular text-sm text-gray-500 px-4 mt-2 mb-8'>The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s), at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as *, -, or #.</p>
                    </div>

                    <div className="mb-12">
                        <label htmlFor="confirmPassword" className="block text-gray-600 font-sf-regular mb-1">Confirm Password</label>
                        <input
                         type="password"
                         id="confirmPassword"
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm h-10 font-sf-regular px-4"
                         required
                     />
                    </div>
                    
                   {message && <p className="mt-4 text-green-500 font-sf-regular text-center mb-4">{message}</p>}
                   {error && <p className="mt-4 text-red-500 font-sf-regular text-center mb-4">{error}</p>}
    
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-800 hover:bg-blue-700 text-white font-sf-light py-2 px-8 rounded-full focus:outline-none focus:shadow-outline"
                            onClick={handleSubmit}
                        >
                        Submit
                        </button>
                    </div>
                </form>
            </div>
            <Modal 
                isOpen={isModalOpen} 
                message="Password has been changed successfully"
                onClose={handleCloseModal} 
            />
        </div>
    );
};

export default ResetPassword;
