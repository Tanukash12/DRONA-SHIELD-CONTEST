import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Shield, LogOut, Loader, Users, BarChart2 } from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'dronaShieldToken';

// --- AUTH HOOK ---
// Custom hook to handle auth state and persistence
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Decode the JWT locally to get the role for UI purposes (NOT for security)
      // Note: This is a placeholder; a real app might verify the token validity with the server first.
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (e) {
        console.error("Invalid token format:", e);
        handleLogout();
      }
    }
    setIsLoading(false);
  }, [token]);

  const handleLogin = (newToken, newRole) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setRole(newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setRole(null);
  };

  return { token, role, isLoading, handleLogin, handleLogout };
};


// --- UTILITY COMPONENTS ---

const AuthForm = ({ title, onSubmit, children, message }) => (
  <div className="w-full max-w-md mx-auto">
    <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-indigo-500">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-5">
        {children}
        {message && (
          <p className={`text-sm font-medium p-2 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  </div>
);

const InputField = ({ id, label, type = 'text', required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
    />
  </div>
);

const Button = ({ children, type = 'submit', className = '', onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${className}`}
  >
    {children}
  </button>
);


// --- SCREENS ---

const LoginScreen = ({ setView, onLogin }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const email = e.target.elements['login-email'].value;
    const password = e.target.elements['login-password'].value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.role);
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed.' });
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage({ type: 'error', text: 'Network error. Check server status.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-16 pb-10 bg-gray-50 min-h-screen">
      <AuthForm title="Welcome Back" onSubmit={handleSubmit} message={message}>
        <InputField id="login-email" label="Email Address" type="email" />
        <InputField id="login-password" label="Password" type="password" />

        <Button disabled={loading}>
          {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
          {loading ? 'Logging In...' : 'Sign In'}
        </Button>
      </AuthForm>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Not a member?{' '}
          <button
            onClick={() => setView('register')}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
          >
            Register for a new account.
          </button>
        </p>
      </div>
    </div>
  );
};

const RegisterScreen = ({ setView }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const name = e.target.elements['register-name'].value;
    const email = e.target.elements['register-email'].value;
    const password = e.target.elements['register-password'].value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful! You can now log in.' });
        e.target.reset();
        setTimeout(() => setView('login'), 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-16 pb-10 bg-gray-50 min-h-screen">
      <AuthForm title="Join DRONA SHIELD" onSubmit={handleSubmit} message={message}>
        <InputField id="register-name" label="Full Name" />
        <InputField id="register-email" label="Email Address" type="email" />
        <InputField id="register-password" label="Password" type="password" />
        <Button disabled={loading} className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500">
          {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
          {loading ? 'Registering...' : 'Register Account'}
        </Button>
      </AuthForm>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
          >
            Sign in here.
          </button>
        </p>
      </div>
    </div>
  );
};

// --- AUTHENTICATED VIEWS ---

const DashboardHeader = ({ title, onLogout }) => (
  <header className="bg-white shadow sticky top-0 z-10">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Shield className="w-6 h-6 mr-2 text-indigo-600" />
        {title}
      </h1>
      <Button onClick={onLogout} className="w-auto px-6 bg-red-500 hover:bg-red-600">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  </header>
);

const AdminDashboard = ({ token, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        setMessage('Access Denied. You must be an admin.');
        onLogout();
        return;
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      setMessage('Error connecting to API or fetching data.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('User status updated successfully!');
        fetchUsers(); // Refresh data
      } else {
        const data = await response.json();
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (e) {
      alert('Network error during update.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Admin Dashboard" onLogout={onLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
              <Users className="w-5 h-5 mr-2 text-teal-500" />
              Registered Users
            </h3>
            {message && <div className="p-3 my-4 bg-yellow-100 text-yellow-700 rounded-lg">{message}</div>}
            {loading ? (
              <div className="flex justify-center items-center py-10"><Loader className="animate-spin w-8 h-8 text-indigo-500" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${user.status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>
                          {user.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.status === 'pending' && (
                            <button
                              onClick={() => updateUserStatus(user._id, 'approved')}
                              className="text-indigo-600 hover:text-indigo-900 font-medium bg-indigo-100 p-1.5 rounded-md text-xs transition"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-4 border-b pb-2 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
              Contest Management
            </h3>
            <p className="text-gray-600">Implement Contest Creation, Deletion, and Status Updates here. This logic would interact with `/api/contests` endpoints.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const UserPortal = ({ onLogout }) => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contests/user`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if(response.ok) {
        setContests(data);
      }
    } catch (e) {
      console.error("Error fetching user contests:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="DRONA SHIELD Portal" onLogout={onLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Assigned Challenges</h3>
            {loading ? (
              <div className="flex justify-center items-center py-10"><Loader className="animate-spin w-8 h-8 text-indigo-500" /></div>
            ) : contests.length === 0 ? (
              <p className="text-gray-600 italic">No live or approved contests assigned to you yet. Check back later!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest) => (
                  <div key={contest._id} className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow hover:shadow-lg transition duration-200">
                    <h4 className="text-xl font-bold text-indigo-800 mb-2">{contest.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">Status: <span className="font-semibold text-green-600">{contest.status.toUpperCase()}</span></p>
                    <Button className="w-full bg-teal-500 hover:bg-teal-600">Start Contest</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const { token, role, isLoading, handleLogin, handleLogout } = useAuth();
  const [view, setView] = useState('login'); // 'login', 'register', 'admin', 'user'

  useEffect(() => {
    if (!isLoading) {
      if (token && role === 'admin') {
        setView('admin');
      } else if (token && role === 'user') {
        setView('user');
      } else {
        // Default to login if no valid token
        setView('login');
      }
    }
  }, [token, role, isLoading]);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader className="animate-spin w-10 h-10 text-indigo-500" />
          <span className="ml-3 text-lg text-gray-600">Loading authentication status...</span>
        </div>
      );
    }
    
    switch (view) {
      case 'register':
        return <RegisterScreen setView={setView} />;
      case 'admin':
        return <AdminDashboard token={token} onLogout={handleLogout} />;
      case 'user':
        return <UserPortal onLogout={handleLogout} />;
      case 'login':
      default:
        return <LoginScreen setView={setView} onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      <style>{`
        /* Load Inter font from CDN */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f4f7f6;
        }
        /* Custom scrollbar for better visual appeal */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
      {renderView()}
    </div>
  );
};

export default App;
