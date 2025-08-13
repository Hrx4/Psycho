const asyncHandler = require('express-async-handler');
const fs = require('fs');
const pdf = require('pdf-parse');
const chunkText = require('../utils/chunkText');
const getEmbeddings = require('../utils/getEmbeddings');
const pineconeIndex = require('../utils/pinecone');


const addFile = asyncHandler(async(req , res)=>{

    const dataBuffer  = fs.readFileSync('./books/friend.pdf');
    const data = await pdf(dataBuffer);
    const text = data.text;

    const chunks = chunkText(text, 1000, 200);

    let vectorList = []

    for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing chunk ${i + 1} / ${chunks.length}`);

    // Get embedding vector from Ollama
    const embedding = await getEmbeddings(chunk);

    vectorList.push({
        id: `chunk-${i + 1}`,
        values: embedding,
        metadata: {
            chunk: i + 1,
            text: chunk,
        }
    })
    // Upsert vector into Pinecone
  }
  console.log("Upserting vectors to Pinecone...")
    await pineconeIndex.upsert(vectorList)

    res.status(200).json({
        message: "File added successfully",
        vectorSize : vectorList.length,
        vectors : vectorList
        
    });

})

module.exports = {
    addFile
}