const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const app = express();
const mysql = require('mysql');

app.use(cors());
app.use(bodyParser.json());

let users = [
  { id: 1, username: '123EMP01', password: 'Ram01', role: 'Software Engineer',Emp_name: 'Ram' },
];

let admins = [
  { id: 1, username: '123MN01', password: 'Anu01', role: 'Admin',ad_name: 'Anu' },
  { id: 2, username: '123MN02', password: 'Kavi02', role: 'Admin',ad_name: 'Kavi'}
];
// Employee login 
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.json({ success: true, message: 'Employee login successful' });
    return Emp_name,username,role;
    console.log(Emp_name);
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Admin login 
app.post('/logins', (req, res) => {
  const { username, password } = req.body;

  const admin = admins.find(admin => admin.username === username && admin.password === password);

  if (admin) {
    res.json({ success: true, message: 'Admin login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});
app.get('/userInfo/:username', (req, res) => {
  const { username } = req.params;
  const user = userData[username];

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

const dbPassword = process.env.MYSQL_PASSWORD;
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: dbPassword, 
  database: 'leave_management' 
});
// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// submit leave form
app.post('/submitforms', (req, res) => {
  const { userId, leaveType, startDate, endDate, totalDays, reason, status } = req.body;

  const sql = 'INSERT INTO leave_form (user_id,leave_type, start_date, end_date, total_days, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [userId,leaveType, startDate, endDate, totalDays, reason,status|| 'pending'], (err, result) => {
    if (err) {
      console.error('Error inserting leave form data:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Leave form submitted successfully');
      res.status(200).json({ message: 'Leave form submitted successfully' });
    }
  });
});
app.get('/leaveForm', async (req, res) => {
  const userId = req.query.userId;
  try {
    const leaveForms = await LeaveForm.find({ userId: userId });
    res.json(leaveForms);
  } catch (error) {
    res.status(500).send('Error fetching leave forms');
  }
});

app.get('/leaveForms', (req, res) => {
  connection.query('SELECT * FROM leave_form', (error, results, fields) => {
    if (error) {
      console.error('Error fetching leave form data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results);
    }
  });
});
// put - approval/rejection
app.put('/leaveForms/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
 console.log(id);
  // Update leave form status
  const sql = 'UPDATE leave_form SET status = ? WHERE id = ?';

  connection.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating leave form:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (result.affectedRows === 0) {
      
      res.status(404).json({ message: 'Leave form not found' });
      console.log(message);
      return;
    }

    res.json({ message: 'Leave form updated successfully' });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
