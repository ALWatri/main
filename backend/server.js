const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const categoriesRoutes = require('./routes/categories');
const items = require('./routes/items');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

dotenv.config();
console.log('JWT_SECRET in server.js:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

const expressJwt = require('express-jwt');
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth',
  }).unless({ path: ['/api/auth/login', '/api/auth/signup', '/api/users', '/api/categories'] })
);

// CORS whitelist
const whitelist = ['http://192.168.1.212:3000', 'https://kabat.app/api'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/items', items);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
