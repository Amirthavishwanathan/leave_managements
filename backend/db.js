
const mysql = require('mysql2');

// Function to create a MySQL connection pool
function createConnectionPool() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'leave_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool.promise();
}

module.exports = createConnectionPool;