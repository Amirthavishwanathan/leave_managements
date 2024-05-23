// Admin Login page
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './login.css';
import  './mng_dash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login1 = () => {
     const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

   const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/logins', {  username, password });
      console.log(username,password)
      if (response.data.success) {
        localStorage.setItem('username', username);
         Swal.fire({
        title: "Login successful!",
        icon: "success",
        timer: 5000, 
        timerProgressBar: true,
        didClose: () => {
          window.location.href = './mng_dash';
        }
      });
      } else {
        Swal.fire({
        title: "Invalid ID or Password",
        icon: "error",
        timer: 5000, 
        timerProgressBar: true,
      });
      }
    } catch (error) {
      Swal.fire({
        title: "Invalid ID or Password",
        icon: "error",
        timer: 5000, 
        timerProgressBar: true,
      });
      console.error('Error:', error);
    }
  };


  return (
    <>
    <div className='pos'>
      
       <div className='container'>
      <form className='login-form' onSubmit={handleSubmit}>
    <h2 className='for'> <center><strong>FOR ADMIN</strong></center> </h2><br/>
    <div className='form-group'>
      <center><h1>LOGIN</h1></center><br/><br/>

        <FontAwesomeIcon icon={faUser} className='user1' />
      
      <input  type="text" className='user2' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='   Enter Admin ID' /><br/><br/>
     
       <FontAwesomeIcon icon={faLock} className='pass1' />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='    Enter Password'/><br/><br/><br/>
      <button className='submit'>Login</button>
      <p>{message}</p>
    </div>
    </form>
    </div>
    </div>
    </>
  );
}

export default Login1;
