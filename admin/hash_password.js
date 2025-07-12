// hash_password.js
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Plain Password:', password);
  console.log('Hashed Password:', hashedPassword);
}

// Replace 'your_first_superadmin_password' with the STRONG password you want for your superadmin
hashPassword('ce5a6e3a79');


async function verify() {
  const dbHash = '$2b$10$jH0bpXjzEJo2kjV1NfhHHe3/UY2Kv2tiGgGW2rthTKCT7VmAinNwO';
  const testHash = '$2b$10$fRKF8lXPWRg4ZletmErXqOJua0Lcl7Xei70DYF4iQg5tTgjXsizvO';
  
  console.log(await bcrypt.compare('ce5a6e3a79', dbHash));    // true
  console.log(await bcrypt.compare('ce5a6e3a79', testHash)); // true
}

verify();