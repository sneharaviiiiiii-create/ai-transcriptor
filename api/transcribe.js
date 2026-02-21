export const config = {
  api: {
    bodyParser: false,
  },
};

const OpenAI = require("openai");
const formidable = require("formidable");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {

    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }

    try {
      const file = fs.createReadStream(files.file[0].filepath);

      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
      });

      res.status(200).json({ text: transcription.text });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Transcription failed" });
    }

  });
};
