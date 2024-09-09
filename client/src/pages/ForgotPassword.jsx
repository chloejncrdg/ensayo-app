import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [linkSent, setLinkSent] = useState(false); 
    const location = useLocation();
    const navigate = useNavigate();
    const [isValidRedirect, setIsValidRedirect] = useState(false);

    const axiosInstance = axios.create({
        baseURL:process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const from = queryParams.get('from');
        
        if (from !== 'login') {
            navigate('/login');
        } else {
            setIsValidRedirect(true);
        }
    }, [location, navigate]);

    if (!isValidRedirect) {
        return <div className='min-h-[80vh]'>Redirecting...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Please enter your email address.');
            setMessage('');
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post('/users/forgot-password', { email });
            setMessage('Password reset link sent. Please check your email.');
            setError('');
            setLinkSent(true); // Set linkSent to true after sending the email
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No account found with that email address.');
            } else {
                setError('Error sending password reset link.');
            }
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            await axiosInstance.post('/users/forgot-password', { email });
            setMessage('Password reset link resent. Please check your email.');
            setError('');
        } catch (err) {
            setError('Error resending password reset link.');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-20 px-4">
            <div className="w-full max-w-xl bg-white px-16 py-10 rounded-2xl shadow-custom-dark">
                <h2 className="text-3xl font-sf-bold text-blue-800 mb-3 text-center">Forgot Password</h2>
                <p className="px-10 text-sm font-sf-regular text-blue-800 mb-6 text-center">
                    Enter the email associated with your eNSAYO account to change your password
                </p>
                <form>
                    <div className="mb-12">
                        <label htmlFor="email" className="block text-gray-600 font-sf-regular mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm h-10 font-sf-regular px-4"
                            required
                            disabled={linkSent} // Disable the input if the link has been sent
                        />
                    </div>
                    
                    {error && <p className="m-4 text-red-500 text-center font-sf-regular">{error}</p>}
                    {message && <p className="m-4 text-green-500 text-center font-sf-regular">{message}</p>}

                    <div className="flex flex-col items-center justify-center">
                        {!linkSent ? (
                            <button
                                type="submit"
                                className={`${
                                    loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-700'
                                } text-white font-sf-light py-2 px-8 rounded-full focus:outline-none focus:shadow-outline`}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        ) : (
                            <>
                                <p className="text-center text-gray-600 font-sf-regular text-sm mt-8">Did not receive an email?</p>
                                <button
                                    type="button"
                                    className='font-sf-regular text-blue-800 py-2 px-8 rounded-full focus:outline-none focus:shadow-outline underline'
                                    onClick={handleResend}
                                    disabled={loading}
                                >
                                    {loading ? 'Resending...' : 'Resend password reset link'}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
