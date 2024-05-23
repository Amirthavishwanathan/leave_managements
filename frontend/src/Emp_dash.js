//Employee Dashboard
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './Emp_dash.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Emp_dash() {
  const sl=7;
  const ml=30;
  const vl=10;
  const el=10;
 const [slbCount, setSlbCount] = useState(0);
  const [mlbCount, setMlbCount] = useState(0);
  const [vlbCount, setVlbCount] = useState(0);
  const [elbCount, setElbCount] = useState(0);

  useEffect(() => {
    // Retrieve leave counts from localStorage
    const slb = localStorage.getItem('slb');
    const mlb = localStorage.getItem('mlb');
    const vlb = localStorage.getItem('vlb');
    const elb = localStorage.getItem('elb');

    // Update state with retrieved leave counts
    if (slb !== null) {
      setSlbCount(parseInt(slb));
    }
    if (mlb !== null) {
      setMlbCount(parseInt(mlb));
    }
    if (vlb !== null) {
      setVlbCount(parseInt(vlb));
    }
    if (elb !== null) {
      setElbCount(parseInt(elb));
    }
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [leaveForms, setLeaveForms] = useState([]);
   const [userInfo, setUserInfo] = useState(null);
   const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

    const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  
  // fetch user details
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/userInfo'); // Replace with your backend endpoint
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

 
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    
    const fetchLeaveForms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/leaveForms');
        setLeaveForms(response.data);
      } catch (error) {
        console.error('Error fetching leave form data:', error);
      }
    };

    fetchLeaveForms();
  }, []);
   const fetchLeaveForms = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/leaveForm?userId=${userId}`);
    setLeaveForms(response.data);
  } catch (error) {
    console.error('Error fetching leave form data:', error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/submitforms', {
        userId : {username},
        leaveType,
        startDate,
        endDate,
        totalDays,
        reason,
        status: 'pending',
        
      });
     
      const response = await axios.get('http://localhost:3000/leaveForms');
      setLeaveForms(response.data);
      localStorage.setItem('leaveType', leaveType); // Save leaveType to localStorage
      navigate('/mng_dash');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setTotalDays('');
      setReason('');
      setShowForm(false);
      alert('Leave form submitted successfully!');
    } catch (error) {
      console.error('Error submitting leave form:', error);
      alert('Error submitting leave form');
    }
  };
   
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    calculateTotalDays(e.target.value, endDate);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    calculateTotalDays(startDate, e.target.value);
  };

  const calculateTotalDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const daysDifference = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; 

  if (isNaN(daysDifference)) {
    setTotalDays(0); 
  } else {
    setTotalDays(daysDifference);
  }
};
const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username1');
    navigate('/login');
  };
 const handlelogout= (e) =>{
  Swal.fire({
        title: "Logout successful!",
        icon: "success",
        timer: 5000,
        timerProgressBar: true,
        didClose: () => { 
          window.location.href = './App.js';
        }
      });
 }
 
 
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <FontAwesomeIcon icon={faChartBar} className='dash'  />
        <h1 style={{ color: 'midnightblue' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dashboard</h1><br/><br/>
        <div>
         
          <div>
              <h2>  &nbsp; &nbsp;ID : {username} </h2>
              </div>
         
   

       
        </div>
      </div>
      <div className="main-content">
        <header>
          <div className="search-container">
             <div className="date-container">
      <div className="date-box">
        <div className="date">{day}</div>
      </div>
      <div className="date-box">
        <div className="date">{month}</div>
      </div>
      <div className="date-box">
        <div className="date">{year}</div>
      </div>
      <h2 className='logout1' onClick={handlelogout}>Logout</h2>
    </div>
          
          </div>
          <div className='small-box'><strong >Sick Leave</strong><h3 className='sb'>Total - {sl}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Take - {slbCount}</h3> </div> 
          <div className='small-box1'><strong>Maternity Leave</strong><h3 className='sb1'>Total - {ml}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Take - {mlbCount}</h3> </div>
          <div className='small-box2'><strong>Vacation Leave</strong><h3 className='sb2'>Total - {vl}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Take - {vlbCount}</h3> </div>
          <div className='small-box3'><strong>Emergency Leave</strong><h3 className='sb3'>Total - {el}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Take - {elbCount}</h3> </div>
        </header>
        
        <table className="leave-table">
        <thead>
          <tr>
            <th>Type of Leave</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Days</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
         <tbody>
          {leaveForms.map(form => (
            <tr key={form.id}>
              <td>{form.leave_type}</td>
              <td>{form.start_date}</td>
              <td>{form.end_date}</td>
              <td>{form.total_days}</td>
              <td>{form.reason}</td>
              <td style={{ backgroundColor: form.status === 'Approved' ? 'rgba(0, 255, 0, 0.5)' : form.status === 'Pending' ? 'rgba(255, 255, 0, 0.5)' : form.status === 'Rejected' ? 'rgba(255, 0, 0, 0.5)' : 'inherit' }}>{form.status}</td>
                
            </tr>
          ))}
        </tbody>
      </table>

        <div className="widgets">
          <button className='app_btt' onClick={toggleForm}>Apply leave</button>
          {showForm && (
            <div className="leave-form-container">
      <h1 className='head'>Leave Form</h1>
      
      <form onSubmit={handleSubmit}>
       
        <div className="form-group">
          
          <label htmlFor="leaveType">Type of Leave:</label>
          <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="">Select leave type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Maternity Leave">Maternity/Paternity Leave</option>
            <option value="Vacation Leave">Vacation Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
            
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input id="startDate" type="date" value={startDate} onChange={handleStartDateChange} />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input id="endDate" type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
        <div className="form-group">
          <label htmlFor="totalDays">Total Days:</label>
          <input id="totalDays" type="text" value={totalDays} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        
        <button type="submit" className='sub'><center>Submit</center></button>
      </form>
    </div>
          )}
        </div>
      </div>
    </div>
  );
 }
export default Emp_dash;
