import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

interface SignInProps {
  onSwitchToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSwitchToSignUp }) => {
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    try {
      await login(username, password);
      setError('');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sign In to Clapback</h2>
      <form onSubmit={handleSignIn} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 p-2 border rounded w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border rounded w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Sign In
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-4">
        Don’t have an account?{' '}
        <button
          onClick={onSwitchToSignUp}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
