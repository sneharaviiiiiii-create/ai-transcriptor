export const config = {
  api: {
    bodyParser: false,
  },
};

import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {

    const file = fs.createReadStream(files.file[0].filepath);

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    res.status(200).json({ text: transcription.text });

  });
}
