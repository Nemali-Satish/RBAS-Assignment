import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ChangePasswordTab = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage('');
    if (error) setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await changePassword(formData.currentPassword, formData.newPassword);

    if (result.success) {
      setMessage('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center space-x-3 mb-6">
        <Lock className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-xl font-bold text-gray-100">Change Password</h2>
          <p className="text-gray-400">Update your account password</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-900 text-green-300 rounded-md text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {['currentPassword', 'newPassword', 'confirmNewPassword'].map((field, idx) => (
          <div key={idx}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-300 mb-2 capitalize"
            >
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <div className="relative">
              <input
                type={showPasswords[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'] ? 'text' : 'password'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-3 pr-10 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-colors"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() =>
                  togglePasswordVisibility(
                    field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'
                  )
                }
              >
                {showPasswords[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'] ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
