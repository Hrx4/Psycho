const { Ollama } = require("ollama");

const ollama = new Ollama();

const getEmbeddings = async (text) => {
  const response = await ollama.embed({
    model: 'nomic-embed-text',
    input: text,
  });
  return response.embeddings[0];
};

module.exports = getEmbeddings;