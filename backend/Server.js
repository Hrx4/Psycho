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






// const fs = require('fs');
// const pdf = require('pdf-parse');

// // Function to chunk text
// function chunkText(text, chunkSize = 1000, overlap = 200) {
//   const chunks = [];
//   let start = 0;
//   while (start < text.length) {
//     const end = Math.min(start + chunkSize, text.length);
//     chunks.push(text.slice(start, end));
//     start += chunkSize - overlap; // overlap chunks
//   }
//   return chunks;
// }

// (async () => {
//   const dataBuffer = fs.readFileSync('./books/friend.pdf');
//   const data = await pdf(dataBuffer);

//   // Split text by page separator
//   // Note: pdf-parse doesn't guarantee perfect page breaks,
//   // but often \n\n or form feed character \f can separate pages
//   const pages = data.text.split('\f'); // form feed often used to separate pages

//   // Get first 10 pages
//   const first10PagesText = pages.slice(0, 10).join('\n');

//   // Chunk the text with overlap
//   const chunks = chunkText(first10PagesText, 1000, 200);

//   chunks.forEach((chunk, i) => {
//     console.log(`--- Chunk ${i + 1} ---`);
//     console.log(chunk);
//   });
// })();
