const { configDotenv } = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

// Load environment variables

// const allowedOrigins = [
//   'http://localhost:8080',                 // Local dev
//   'https://psycho-weml.vercel.app'       // Deployed frontend
// ];
// {
//  origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); // Allow request
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },    credentials: false , 
//     preflightContinue: false,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   }

app.use(cors());

// app.options('*', cors()); // handle preflight

// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

app.use(express.json());
configDotenv();


// ✅ Handle OPTIONS preflight for all routes
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Hello, World! This is my Express server!${PORT}`);
});

app.use('/files', require('./routes/fileRouters'));
app.use('/query', require('./routes/queryRoutes'));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app; 

