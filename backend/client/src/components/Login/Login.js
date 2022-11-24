import React, { useState, useContext } from 'react';
import './login.scss';
import { FaHospitalSymbol } from 'react-icons/fa';
import AdminContext from '../../context/Admin/AdminContext';
import { Redirect } from 'react-router-dom';

const Login = () => {
  const { loginAdmin, isAuth } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginHandler = (e) => {
    e.preventDefault();
    console.log('logged in');
    loginAdmin(email, password);
  };

  if (isAuth) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='login-container'>
      <div className='login-actions-container'>
        <div className='login-form-container'>
          <form onSubmit={(e) => loginHandler(e)}>
            <h3>Login Portal</h3>
            <div className='form-input-main'>
              <div className='form-input-container'>
                <label htmlFor='email'>Email:</label>
                <input
                  type='email'
                  className='form-input'
                  name='email'
                  value={email}
                  placeholder='Admin email address...'
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <div className='form-input-container'>
                <label htmlFor='password'>Password:</label>
                <input
                  type='password'
                  className='form-input'
                  name='password'
                  value={password}
                  placeholder='Admin password...'
                  onChange={(e) => onChange(e)}
                  required
                />
              </div>
              <button type='submit' className='login-btn'>
                Log In
              </button>
            </div>
            
          </form>
        </div>
        <div className='login-form-carousel'>
          <FaHospitalSymbol className='hospital-icon' />
          <h2>Hospital-App </h2>
          <h2>Admin Control</h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
