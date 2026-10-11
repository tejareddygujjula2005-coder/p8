import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
  useParams,
  useNavigate,
} from 'react-router-dom';

import './App.css';

const ThemeContext = createContext();

function useTheme() {
  return useContext(ThemeContext);
}

function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <nav className="navbar">
        <h2>React Router Demo</h2>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            About
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/user/1"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            User Profile
          </NavLink>
        </div>

        <button onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <section className="card">
      <h1>Home Page</h1>
      <p>Welcome to our React Router application!</p>
      <p>Navigate using the menu to explore the pages.</p>

      <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
    </section>
  );
}

function About() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="card">
      <h1>About Page</h1>
      <p>This page demonstrates useEffect and state updates.</p>

      <h2>Current Time</h2>
      <div className="clock">{time.toLocaleTimeString()}</div>
    </section>
  );
}

function Dashboard() {
  const [count, setCount] = useState(0);

  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p>Click the buttons to update the counter.</p>

      <div className="counter">
        <button onClick={() => setCount(count - 1)}>Decrement</button>

        <h2>Count: {count}</h2>

        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>

      <button className="reset-button" onClick={() => setCount(0)}>
        Reset Counter
      </button>
    </section>
  );
}

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(null);
    setLoading(true);

    const timer = setTimeout(() => {
      const users = {
        1: { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        2: { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      };

      setUser(
        users[userId] || {
          name: 'Guest User',
          email: 'guest@example.com',
          role: 'Visitor',
        }
      );

      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [userId]);

  return (
    <section className="card">
      <h1>User Profile</h1>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading user details...</p>
        </div>
      )}

      {!loading && user && (
        <div className="profile">
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      )}
    </section>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="card">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the requested page does not exist.</p>

      <button onClick={() => navigate('/')}>Back to Home</button>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user/:userId" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
