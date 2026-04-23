<<<<<<< HEAD
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devopsdb';

// Track MongoDB connection status
let mongoConnected = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection with retry logic
function connectMongo() {
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  })
    .then(() => {
      mongoConnected = true;
      console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
      mongoConnected = false;
      console.log('⚠️  MongoDB not available - running in demo mode');
      console.log('   Error:', err.message);
      console.log('   Retrying in 10 seconds...');
      setTimeout(connectMongo, 10000);
    });
}

connectMongo();

// Simple Task model
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

// In-memory storage for demo mode (when MongoDB not available)
let demoTasks = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'App is running', 
    regNo: 'FA23-BCS-214',
    database: mongoConnected ? 'Connected' : 'Disconnected (demo mode)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tasks', async (req, res) => {
  try {
    if (mongoConnected) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json({
        tasks,
        mode: 'database',
        count: tasks.length
      });
    } else {
      // Return demo tasks when DB not available
      res.json({
        tasks: demoTasks.sort((a, b) => b.createdAt - a.createdAt),
        mode: 'demo',
        count: demoTasks.length,
        message: 'Running in demo mode - data will be lost on restart'
      });
    }
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      mode: 'demo',
      tasks: demoTasks.sort((a, b) => b.createdAt - a.createdAt)
    });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const title = req.body.title?.trim();
    if (!title || title.length === 0) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }
    if (title.length > 200) {
      return res.status(400).json({ error: 'Title must be max 200 characters' });
    }
    
    if (mongoConnected) {
      const task = new Task({ title });
      await task.save();
      res.status(201).json({ 
        ...task.toObject(),
        mode: 'database'
      });
    } else {
      // Demo mode: save to memory
      const demoTask = {
        _id: Date.now().toString(),
        title,
        createdAt: new Date()
      };
      demoTasks.push(demoTask);
      res.status(201).json({ 
        ...demoTask,
        mode: 'demo',
        message: 'Saved in demo mode - will be lost on restart'
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    if (mongoConnected) {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted', mode: 'database' });
    } else {
      // Demo mode: delete from memory
      demoTasks = demoTasks.filter(t => t._id !== req.params.id);
      res.json({ 
        message: 'Task deleted (demo mode)',
        mode: 'demo'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════╗');
  console.log('║   DevOps Task Manager App          ║');
  console.log('║   FA23-BCS-214                     ║');
  console.log('╠════════════════════════════════════╣');
  console.log(`║   Server: http://localhost:${PORT}   ${'              '.substring(PORT.toString().length)}║`);
  console.log('║   API:    http://localhost:3000/api║');
  console.log('║   Status: ✅ Ready                  ║');
  console.log('╚════════════════════════════════════╝');
  console.log('');
  console.log(`Database: ${mongoConnected ? '✅ MongoDB Connected' : '⚠️  Demo Mode (in-memory)'}`);
  console.log('');
});
=======
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devopsdb';

// Track MongoDB connection status
let mongoConnected = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection with retry logic
function connectMongo() {
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  })
    .then(() => {
      mongoConnected = true;
      console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
      mongoConnected = false;
      console.log('⚠️  MongoDB not available - running in demo mode');
      console.log('   Error:', err.message);
      console.log('   Retrying in 10 seconds...');
      setTimeout(connectMongo, 10000);
    });
}

connectMongo();

// Simple Task model
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

// In-memory storage for demo mode (when MongoDB not available)
let demoTasks = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'App is running', 
    regNo: 'FA23-BCS-214',
    database: mongoConnected ? 'Connected' : 'Disconnected (demo mode)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tasks', async (req, res) => {
  try {
    if (mongoConnected) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json({
        tasks,
        mode: 'database',
        count: tasks.length
      });
    } else {
      // Return demo tasks when DB not available
      res.json({
        tasks: demoTasks.sort((a, b) => b.createdAt - a.createdAt),
        mode: 'demo',
        count: demoTasks.length,
        message: 'Running in demo mode - data will be lost on restart'
      });
    }
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      mode: 'demo',
      tasks: demoTasks.sort((a, b) => b.createdAt - a.createdAt)
    });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const title = req.body.title?.trim();
    if (!title || title.length === 0) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }
    if (title.length > 200) {
      return res.status(400).json({ error: 'Title must be max 200 characters' });
    }
    
    if (mongoConnected) {
      const task = new Task({ title });
      await task.save();
      res.status(201).json({ 
        ...task.toObject(),
        mode: 'database'
      });
    } else {
      // Demo mode: save to memory
      const demoTask = {
        _id: Date.now().toString(),
        title,
        createdAt: new Date()
      };
      demoTasks.push(demoTask);
      res.status(201).json({ 
        ...demoTask,
        mode: 'demo',
        message: 'Saved in demo mode - will be lost on restart'
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    if (mongoConnected) {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted', mode: 'database' });
    } else {
      // Demo mode: delete from memory
      demoTasks = demoTasks.filter(t => t._id !== req.params.id);
      res.json({ 
        message: 'Task deleted (demo mode)',
        mode: 'demo'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════╗');
  console.log('║   DevOps Task Manager App          ║');
  console.log('║   FA23-BCS-214                     ║');
  console.log('╠════════════════════════════════════╣');
  console.log(`║   Server: http://localhost:${PORT}   ${'              '.substring(PORT.toString().length)}║`);
  console.log('║   API:    http://localhost:3000/api║');
  console.log('║   Status: ✅ Ready                  ║');
  console.log('╚════════════════════════════════════╝');
  console.log('');
  console.log(`Database: ${mongoConnected ? '✅ MongoDB Connected' : '⚠️  Demo Mode (in-memory)'}`);
  console.log('');
});
>>>>>>> c9d92cdf2d5f35fe2c56ff2f53250125526fa9e4
