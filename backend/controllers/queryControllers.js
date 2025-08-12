const asyncHandler = require('express-async-handler');
const pineconeIndex = require('../utils/pinecone');
const getEmbeddings = require('../utils/getEmbeddings');
const PROMPT = require('../utils/prompt');
const {GoogleGenAI} = require('@google/genai');

const getAnswer = asyncHandler(async(req , res)=>{

    res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache, no-transform');
res.setHeader('Connection', 'keep-alive');


    const { query } = req.body;
    console.log(query)

    const namespace = await pineconeIndex.namespace('__default__')

    const getQueryEmbeddings = await getEmbeddings(query);

    const answer = await namespace.query({
       vector: getQueryEmbeddings,
       topK: 5,
       includeMetadata: true,

    })

    const context = answer.matches.map((item , index)=>( item.metadata.text)).join('\n\n');

    const questionPrompt = PROMPT(context  , query);

    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

    const result = await ai.models.generateContentStream({
        model: "gemini-2.0-flash-001",
        contents : questionPrompt
    })
    

for await (const chunk of result) {
    res.write(` ${chunk.text}`); // Send each chunk
  }

  res.write(`\n\n:)`);
  res.end();

})

module.exports = {
    getAnswer
}