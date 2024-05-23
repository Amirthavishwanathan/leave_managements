import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import EmployeeLogin from './login';
import AdminLogin from './login1';
import Emp_dash from './Emp_dash'
import React, { useState } from 'react'; 
import './App.css';
import Mng_dash from './mng_dash';


const App = () => {
   
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <div className='box'>
              <div className='c1'>
                <div className='top'>
              <h2 className='emp' > <a href="/employee" style={{ color: 'black', textDecoration: 'none' }}>Employee </a></h2>
              <h2 className='ad'> <a href="/admin" style={{ color: 'black', textDecoration: 'none' }}>Admin </a></h2>
              <h3 className='head'>Switch Account</h3>
            
               </div>
              </div>
            
          
            </div>
            
          </ul>
        </nav>

        <Routes>
            <Route path="/employee" element={<EmployeeLogin />} />
            <Route path="/admin" element={<AdminLogin />} />   
            <Route path="/Emp_dash" element={<Emp_dash />} /> 
            <Route path="/mng_dash" element={<Mng_dash />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
       