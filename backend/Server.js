const { configDotenv } = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

// Load environment variables

const corsOptions = {
  origin: ["http://localhost:8080" , "https://psycho-nu.vercel.app/" , "https://psycho-weml.vercel.app/"],

};

app.use(express.json());
app.use(cors(corsOptions));
configDotenv();

app.get("/", (req, res) => {
  res.send("Hello, World! This is my Express server!");
});

app.use('/files', require('./routes/fileRouters'));
app.use('/query', require('./routes/queryRoutes'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


