//Admin Dashboard
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './mng_dash.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Mng_dash = ({leaveType}) =>  {

  
   const [slb, setSlb] = useState(0);
  const [mlb, setMlb] = useState(0);
  const [vlb, setVlb] = useState(0);
  const [elb, setElb] = useState(0);
  
 const [leaveForms, setLeaveForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const [showPendingTable, setShowPendingTable] = useState(true); 
const [showApprovalTable, setShowApprovalTable] = useState(false); 
  const [showRejectedTable, setShowRejectedTable] = useState(false);
  

const handleShowApprovalTable = () => {
  setShowPendingTable(false); 
  setShowApprovalTable(true); 
   setShowRejectedTable(false);
  fetchAllLeaveForms();
};

const handleShowPendingTable = () => {
  setShowPendingTable(true); 
  setShowApprovalTable(false); 
   setShowRejectedTable(false);
  fetchAllLeaveForms(); 
};
const handleShowRejectedTable = () => {
  setShowPendingTable(false);
  setShowApprovalTable(false);
  setShowRejectedTable(true);
  fetchAllLeaveForms(); 
};
  useEffect(() => {
    fetchAllLeaveForms();
  }, []);

  const fetchAllLeaveForms = async () => {
    try {
      const response = await fetch('http://localhost:3000/leaveForms');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setLeaveForms(data);
    } catch (error) {
      console.error('Error fetching all leave forms:', error);
    }
  };
  const handleApproval = async (id, e) => {
  e.preventDefault();
  try {
    const updatedForms = leaveForms.map(form =>
      form.id === id ? { ...form, status: 'Approved' } : form
    );
    closeFormDetails();
    setLeaveForms(updatedForms);

    await axios.put(`http://localhost:3000/leaveForms/${id}`, { status: 'approved' });

    let slbCount = slb;
    let mlbCount = mlb;
    let vlbCount = vlb;
    let elbCount = elb;
    updatedForms.forEach(form => {
      if (form.status === 'Approved') {
        if (form.leave_type === 'Sick Leave') {
          slbCount++;
        } else if (form.leave_type === 'Maternity Leave') {
          mlbCount++;
        } else if (form.leave_type === 'Vacation Leave') {
          vlbCount++;
        } else {
          elbCount++;
        }
      }
    });

    setSlb(slbCount);
    setMlb(mlbCount);
    setVlb(vlbCount);
    setElb(elbCount);

    localStorage.setItem('slb', slbCount);
    localStorage.setItem('mlb', mlbCount);
    localStorage.setItem('vlb', vlbCount);
    localStorage.setItem('elb', elbCount);
  } catch (error) {
    console.error('Error approving leave form:', error);
  }
};


  
  const handleRejection = async (id, e) => {
    e.preventDefault();
    try {
      const updatedForms = leaveForms.map(form =>
        form.id === id ? { ...form, status: 'Rejected' } : form
      );
      closeFormDetails();
      setLeaveForms(updatedForms);
  
      await axios.put(`http://localhost:3000/leaveForms/${id}`, { status: 'rejected' });
    } catch (error) {
      console.error('Error rejecting leave form:', error);
    }
  };
  
  const openFormDetails = (form) => {
    setSelectedForm(form);
  };

  const closeFormDetails = () => {
    setSelectedForm(false);
  };
   const handlelogout= (e) =>{
  Swal.fire({
        title: "Logout successful!",
        icon: "success",
        timer: 5000, // Show the alert for 3 seconds
        timerProgressBar: true,
        didClose: () => { 
          window.location.href = './App.js';
        }
      });
 }
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
    localStorage.removeItem('username');
    navigate('/login');
  };
   
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <FontAwesomeIcon icon={faChartBar} className='dash' />
        <h1 style={{ color: 'midnightblue' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dashboard</h1><br /><br />
        <div>
          <h1 className='dash1'> &nbsp;&nbsp;&nbsp; {username}</h1>
          <h1 className='dash1'>&nbsp;&nbsp;&nbsp; ADMIN</h1>
          
        </div>
      </div>
      <div className="main-content">
        <header>
          <div className="search-container">
            <div className="date-container">
              
        <h2 className='logout' onClick={handlelogout}>Logout</h2>
      <div className="date-box">
        <div className="date">{day}</div>
      </div>
      <div className="date-box">
        <div className="date">{month}</div>
      </div>
      <div className="date-box">
        <div className="date">{year}</div>
      </div>
          </div>
          <div/>
          </div>
        </header>

      
  <div>
    <button className='app_bt' onClick={handleShowPendingTable}>Pending</button>
    <div/>
    <div>
     <button className='app_bt1' onClick={handleShowApprovalTable}>Approved</button>
    </div>
     <div>
             <button className='app_bt2' onClick={handleShowRejectedTable}>Rejected</button>
          </div>
    {showPendingTable && (
        <table className="leave-table">
         <thead>
        <tr>
          <th>Type of Leave</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Total Days</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      {/* Table body */}
      <tbody>
        {leaveForms.map(form => (
          <tr key={form.id}>
          {form.status==='Pending' &&(
            <>
            <td>{form.leave_type}</td>
            <td>{form.start_date}</td>
            <td>{form.end_date}</td>
            <td>{form.total_days}</td>
            <td>{form.reason}</td>
            <td style={{ backgroundColor: form.status === 'Approved' ? 'rgba(0, 255, 0, 0.5)' : form.status === 'Pending' ? 'rgba(255, 255, 0, 0.5)' : form.status === 'Rejected' ? 'rgba(255, 0, 0, 0.5)' : 'inherit' }}>{form.status}</td>
            <td><button className='view' onClick={() => openFormDetails(form)}>View</button></td>
            </>
            )}
          </tr>
        ))}
      </tbody>
        </table>
      )}
      {showApprovalTable && (
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
      {/* Table body */}
      <tbody>
        {leaveForms.map(form => (
          <tr key={form.id}>
            {form.status ==='Approved'&&(
              <>
            <td>{form.leave_type}</td>
            <td>{form.start_date}</td>
            <td>{form.end_date}</td>
            <td>{form.total_days}</td>
            <td>{form.reason}</td>
            <td style={{ backgroundColor: form.status === 'Approved' ? 'rgba(0, 255, 0, 0.5)' : form.status === 'Pending' ? 'rgba(255, 255, 0, 0.5)' : form.status === 'Rejected' ? 'rgba(255, 0, 0, 0.5)' : 'inherit' }}>{form.status}</td>
            
            </>
           )}
          </tr>
        ))}
      </tbody>
        </table>
      )}
         {showRejectedTable && (
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
    {/* Table body */}
    <tbody>
      {leaveForms.map(form => (
        <tr key={form.id}>
          {form.status==='Rejected'&&(
            <>
          <td>{form.leave_type}</td>
          <td>{form.start_date}</td>
          <td>{form.end_date}</td>
          <td>{form.total_days}</td>
          <td>{form.reason}</td>
          <td style={{ backgroundColor: form.status === 'Rejected' ? 'rgba(255, 0, 0, 0.5)' : 'inherit' }}>{form.status}</td>
          </>
          )}
        </tr>
      ))}
    </tbody>
  </table>
)} 
         
          {selectedForm && (
            <div className="modal">
              <div className="modal-content">
                <form className='form'>
                  <span className="close" onClick={closeFormDetails}>&times;</span>
                    <h3 className='uname'>ID : {selectedForm.user_id}</h3>
                    <center> <h2>Leave Form Details</h2></center>
                  <div className="form-details">
                    <div className="form-field">
                      <p><strong>Type of Leave: &nbsp;&nbsp;&nbsp;</strong> {selectedForm.leave_type}</p>
                    </div>
                    <div className="form-field">
                      <p><strong>Start Date:</strong>{selectedForm.start_date}</p>
                    </div>
                    <div className="form-field">
                      <p><strong>End Date:&nbsp;&nbsp;</strong>{selectedForm.end_date}</p>
                    </div>
                    <div className="form-field">
                      <p><strong>Total Days:&nbsp;&nbsp;&nbsp;</strong>{selectedForm.total_days}</p>
                    </div>
                    <div className="form-field">
                      <p><strong>Reason:&nbsp;&nbsp;&nbsp;</strong>{selectedForm.reason}</p>
                    </div>
                    <div className="form-field">
                      <p ><strong>Balance leave:&nbsp;&nbsp;&nbsp;</strong><h5 className='bl'>SL - {slb}</h5><h5 className='bl1'>ML - {mlb}</h5><h5 className='bl2'>VL - {vlb}</h5><h5 className='bl3'>EL - {elb}</h5></p>
                    </div>
                  </div>
                  {selectedForm.status === 'Pending' && (
                  <div className="form-actions">
                    <button className='approved' onClick={(e) => handleApproval(selectedForm.id, e)}>Approve</button>
                    <button className='rejected' onClick={(e) => handleRejection(selectedForm.id, e)}>Reject</button>
                  </div>
                )}
                </form>
              
              </div>
            </div>
          )}
           
          
        </div>
      </div>
    </div>
  );
}


export default Mng_dash;