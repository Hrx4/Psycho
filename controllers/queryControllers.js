const asyncHandler = require('express-async-handler');
const pineconeIndex = require('../utils/pinecone');
const getEmbeddings = require('../utils/getEmbeddings');

const getAnswer = asyncHandler(async(req , res)=>{

    const namespace = await pineconeIndex.namespace('__default__')

    const getQueryEmbeddings = await getEmbeddings("what is this book about?");

    const answer = await namespace.query({
       vector: getQueryEmbeddings,
       topK: 5,
       includeMetadata: true,

    })

    res.status(200).json({
        message: "Hello, World! This is my Express server!",
        answer: answer,
    });
})

module.exports = {
    getAnswer
}