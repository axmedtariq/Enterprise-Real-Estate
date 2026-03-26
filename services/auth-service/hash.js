const bcrypt = require('bcrypt');
const hash = bcrypt.hashSync('admin123', 10);
console.log(Buffer.from(hash).toString('base64'));
