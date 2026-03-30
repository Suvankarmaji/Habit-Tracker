import React, { useState } from 'react';
import styles from './Signstyle.module.css';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Check if user exists
    const userExists = users.find(u => 
      u.username === formData.username && 
      u.email === formData.email && 
      u.password === formData.password
    );

    if (userExists) {
      localStorage.setItem('currentUser', JSON.stringify(userExists));
      navigate('/HabitTracker'); // Redirect to dashboard
    } else {
      setError('Invalid username, email, or password.');
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Sign In</h1>
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '-10px', marginBottom: '10px' }}>{error}</p>}
          <div className={styles.input}>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <span style={{ cursor: 'pointer', color: '#007bff', fontSize: '13px', textDecoration: 'none' }}>Forgot Password?</span>
          </div>
          <div className={styles.buttons}>
            <button onClick={handleSignIn}>Sign In &#8658;</button>
          </div>
          <div className={styles.paragraph}>
            <span>or sign in with</span>
          </div>
          <div className={styles.button1}>
            <button id={styles.but1}>Facebook</button>
            <button id={styles.but2}>Google</button>
          </div>
          <div className={styles.paragraph1}>
            <span>
              Not a Member?<Link to="/SignUp" className={styles.signUp}>Click here</Link>

            </span>
          </div>
          <div className={styles.home}>
            <Link to="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
