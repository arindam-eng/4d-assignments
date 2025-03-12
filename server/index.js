import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let submissions = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    employeeId: 'ABC-12345',
    phoneNumber: '1 (555) 555-5555',
    salary: 50000,
    startDate: '2020-01-01',
    supervisorEmail: 'supervisor1@the4d.ca',
    costCenter: 'SA-212-XYZ',
    projectCode: 'PRJ-2024-004',
    privacyConsent: true,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    employeeId: 'ABC-12344',
    phoneNumber: '1 (555) 555-5555',
    salary: 60000,
    startDate: '2020-02-01',
    supervisorEmail: 'supervisor2@the4d.ca',
    costCenter: 'ON-323-ABC',
    projectCode: 'PRJ-2024-003',
    privacyConsent: true,
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    employeeId: 'ABC-12346',
    phoneNumber: '1 (555) 555-5555',
    salary: 55000,
    startDate: '2020-03-01',
    supervisorEmail: 'supervisor3@the4d.ca',
    costCenter: 'NN-211-DSA',
    projectCode: 'PRJ-2024-001',
    privacyConsent: false,
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Williams',
    employeeId: 'ABC-12347',
    phoneNumber: '1 (555) 555-5555',
    salary: 58000,
    startDate: '2020-04-01',
    supervisorEmail: 'supervisor4@the4d.ca',
    costCenter: 'AN-923-CAS',
    projectCode: 'PRJ-2024-002',
    privacyConsent: true,
  },
];

app.use(express.static(join(__dirname, '../dist')));

app.post('/api/submit', (req, res) => {
  const formData = {
    id: Date.now().toString(),
    ...req.body,
  };
  submissions.push(formData);
  res.json({ data: formData });
});

app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

/**
 * File uploads
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['text/csv', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only csv and text files are allowed'),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();

    if (fileType === '.csv') {
      processCSV(filePath, req.file.filename, res);
    } else if (fileType === '.txt') {
      processTXT(filePath, req.file.filename, res);
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error processing file', error: error.message });
  }
});

// Process CSV filetype
const processCSV = (filePath, filename, res) => {
  let extractedData = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      extractedData.push(row);
      console.log('====================================');
      console.log(row);
      console.log('====================================');
      submissions.push(row);
    })
    .on('end', () => {
      res.json({
        message: 'csv processed successfully',
        filename,
        data: extractedData,
      });
    })
    .on('error', (error) => {
      res
        .status(500)
        .json({ message: 'Error processing csv file', error: error.message });
    });
};

// Process TXT filetype
const processTXT = (filePath, filename, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error processing text file', error: err.message });
    }
    const extractedData = data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => {
        const [
          id,
          firstName,
          lastName,
          employeeId,
          phoneNumber,
          salary,
          startDate,
          supervisorEmail,
          costCenter,
          projectCode,
          privacyConsent,
        ] = line.split(',');

        return {
          id: id.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          employeeId: employeeId.trim(),
          phoneNumber: phoneNumber.trim(),
          salary: Number(salary.trim()) || 0,
          startDate: startDate.trim(),
          supervisorEmail: supervisorEmail.trim(),
          costCenter: costCenter.trim(),
          projectCode: projectCode.trim(),
          privacyConsent: privacyConsent.trim() === 'true',
        };
      });

    console.log('====================================');
    console.log(extractedData);
    console.log('====================================');

    submissions.push(...extractedData);

    res.json({
      message: 'Text data processed successfully',
      filename,
      data: extractedData,
    });
  });
};

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
