const { configDotenv } = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

// Load environment variables

app.use(express.json());
app.use(cors());
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


