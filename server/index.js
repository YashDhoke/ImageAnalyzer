import express from 'express' ; 
import multer from 'multer';
import { createWorker } from 'tesseract.js';

const app = express() ; 
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'server/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage });

app.get('/', (req, res) => {
    res.send('Welcome to the Image Analyzer API');
  });

  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(`server/uploads/${req.file.filename}`);
      await worker.terminate();
  
      /////        changes needed just testing for now ! 
      console.log('Text:', text);
      console.log('Image:', req.file);
  
      res.status(200).json({ text, image: req.file });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });