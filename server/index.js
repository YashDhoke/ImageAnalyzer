import express from 'express';
import multer from 'multer';
import { createWorker } from 'tesseract.js';

const app = express();
const PORT = process.env.PORT || 3000;


const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Welcome to the Image Analyzer API');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image file.' });
    }

    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(req.file.buffer);
    await worker.terminate();

    console.log('Extracted Text:', text);
    console.log('Uploaded Image:', req.file.originalname);

    res.status(200).json({ text, imageName: req.file.originalname });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
