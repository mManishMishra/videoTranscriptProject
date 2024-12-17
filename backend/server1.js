// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const { Deepgram } = require('@deepgram/sdk');
// const ffmpegPath = require('ffmpeg-static');
// const ffmpeg = require('fluent-ffmpeg');
// const multer = require('multer');

// ffmpeg.setFfmpegPath(ffmpegPath);

// const DEEPGRAM_API_KEY = 'b6befaf34e0aeb334dec44919f76c0db057bd58e';
// const { createClient } = require("@deepgram/sdk");
// const deepgram = createClient(DEEPGRAM_API_KEY);

// const app = express();
// const port = process.env.PORT || 5000;
// const upload = multer({ dest: 'uploads/' });

// app.post('/transcribe', upload.single('video'), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     let audioPath = filePath;

//     const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
//       fs.readFileSync(audioPath),
//       {
//         model: "nova-2",
//         smart_format: true,
//       }
//     );

//     if (error) throw error;

//     if (!error) {
//       const transcript = result.results.channels[0].alternatives[0].transcript;
//       const words = result.results.channels[0].alternatives[0].words;

//       // Group words into sentences based on pauses or intervals
//       const sentenceSegments = [];
//       let currentSentence = { text: "", start: words[0].start, end: words[0].end };

//       words.forEach((word, index) => {
//         const nextWord = words[index + 1];
//         currentSentence.text += `${word.word} `;
//         currentSentence.end = word.end;

//         if (nextWord && nextWord.start - word.end > 0.2) {
//           sentenceSegments.push({ ...currentSentence });
//           currentSentence = { text: "", start: nextWord.start, end: nextWord.end };
//         }
//       });

//       // Add the last sentence
//       if (currentSentence.text.trim()) {
//         sentenceSegments.push({ ...currentSentence });
//       }

//       // Generate drawtext filter for sentences
//       // const drawTextFilter = sentenceSegments.map(segment => {
//       //   const escapedText = segment.text.replace(/'/g, "'\\''").replace(/\?/g, '\\?');
//       //   return `drawtext=text='${escapedText.trim()}':fontfile='C\\\\:\\\\Windows\\\\\\\\Fonts\\\\Arial.ttf':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=h-(text_h+10):enable='between(t,${segment.start},${segment.end})'`;
//       // }).join(',');

//       const drawTextFilter = sentenceSegments.map(segment => {
//         const escapedText = segment.text.replace(/'/g, "'\\''").replace(/\?/g, '\\?');
//         return `drawtext=text='${escapedText.trim()}':font='Tahoma':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-(text_h+10):enable='between(t,${segment.start},${segment.end})'`;
//       }).join(',');
      

//       const outputPath = filePath.concat('-captioned.mp4');

//       ffmpeg(filePath)
//         .videoFilter(drawTextFilter)
//         .output(outputPath)
//         .on('end', function () {
//           console.log('Processing finished successfully');
//           res.json({ message: 'Video processed successfully', outputPath });
//         })
//         .on('error', function (err) {
//           console.error('An error occurred: ' + err.message);
//           res.status(500).json({ error: 'Video processing failed' });
//         })
//         .run();
//     }
//   } catch (error) {
//     console.error('General error:', error);
//     res.status(500).json({ error: 'An error occurred during transcription or processing' });
//   }
// });


// app.listen(port, () => console.log(`Server listening on port ${port}`));



const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { Deepgram } = require('@deepgram/sdk');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');


const SECRET_KEY = '12345678'; // Use a secure secret key

//Connect to database 
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/videoTranscript', {
    
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


ffmpeg.setFfmpegPath(ffmpegPath);

const DEEPGRAM_API_KEY = 'b6befaf34e0aeb334dec44919f76c0db057bd58e';
const { createClient } = require("@deepgram/sdk");
const deepgram = createClient(DEEPGRAM_API_KEY);

const app = express();
app.use(express.json());


const port = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST','PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/processed', express.static(path.join(__dirname, 'processed')));

// Configure multer to save uploaded files
const upload = multer({ dest: 'uploads/' });


const processedDir = path.join(__dirname, 'processed');
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir);
}

app.use(express.static(processedDir));

// Video transcription and captioning endpoint
app.post('/transcribe', upload.single('video'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const audioPath = filePath;

    // Transcribe the video
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(audioPath),
      {
        model: "nova-2",
        smart_format: true,
      }
    );

    if (error) throw error;

    const transcript = result.results.channels[0].alternatives[0].transcript;
    const words = result.results.channels[0].alternatives[0].words;

    // Process words into sentences
    const sentenceSegments = [];
    let currentSentence = { text: "", start: words[0].start, end: words[0].end };

    words.forEach((word, index) => {
      const nextWord = words[index + 1];
      currentSentence.text += `${word.word} `;
      currentSentence.end = word.end;

      if (nextWord && nextWord.start - word.end > 0.2) {
        sentenceSegments.push({ ...currentSentence });
        currentSentence = { text: "", start: nextWord.start, end: nextWord.end };
      }
    });

    if (currentSentence.text.trim()) {
      sentenceSegments.push({ ...currentSentence });
    }

    // Create drawtext filter
    const drawTextFilter = sentenceSegments.map(segment => {
      const escapedText = segment.text.replace(/'/g, "'\\''").replace(/\?/g, '\\?');
      return `drawtext=text='${escapedText.trim()}':font='Tahoma':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-(text_h+10):enable='between(t,${segment.start},${segment.end})'`;
    }).join(',');

    // output path
    const outputFilename = `${req.file.filename}-captioned.mp4`;
    // const outputPath = path.join(processedDir, outputFilename);
    const outputPath = `processed/${path.basename(filePath)}-captioned.mp4`;

    // captions using ffmpeg
    ffmpeg(filePath)
      .videoFilter(drawTextFilter)
      .output(path.join(__dirname, outputPath))
      .on('end', function () {
        console.log('Processing finished successfully');
        const fileUrl =`http://localhost:5000/${outputPath}`;
        const downloadFileUrl= `http://localhost:5000/download/${outputFilename}`;
        res.json({ message: 'Video processed successfully', fileUrl,downloadFileUrl });
      })
      .on('error', function (err) {
        console.error('An error occurred: ' + err.message);
        res.status(500).json({ error: 'Video processing failed' });
      })
      .run();
  } catch (error) {
    console.error('General error:', error);
    res.status(500).json({ error: 'An error occurred during transcription or processing' });
  }
});

// File download 
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(processedDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath); 
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});






// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    //Dummy data if no database connected 
    // if (username === 'admin' && password === 'admin') {
    //   const token = jwt.sign({ userId: 'dummyAdmin', role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    //   return res.json({ 
    //     token, 
    //     role: 'admin', 
    //     username: 'admin', 
    //     email: 'admin@admin.com' 
    //   });
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token , role:user.role ,  username: user.username,email:user.email||"admin@admin.com"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; 
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access forbidden' });
  }
  next();
};



//route accessible only to admins
app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

//route accessible to both admins and normal users
app.get('/user', authenticate, authorize(['admin', 'user']), (req, res) => {
  res.json({ message: 'Welcome, User!' });
});


// User management routes

// Get all users
app.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user
app.get('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
app.post('/users', authenticate, authorize(['admin']), async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role, email });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
app.put('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { username, password, role, email } = req.body;
  console.log("Update request made" , req.body);
  
  try {
    const updatedData = { username, role, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
