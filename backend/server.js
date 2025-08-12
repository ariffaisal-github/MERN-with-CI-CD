const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'texts.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch (err) {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function generateId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

async function readTexts() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

async function writeTexts(texts) {
  await fs.writeFile(DATA_FILE, JSON.stringify(texts, null, 2), 'utf-8');
}

app.get('/api/texts', async (req, res) => {
  try {
    const texts = await readTexts();
    res.json(texts);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read texts' });
  }
});

app.post('/api/texts', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    const texts = await readTexts();
    const item = {
      id: generateId(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    texts.push(item);
    await writeTexts(texts);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save text' });
  }
});

app.delete('/api/texts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const texts = await readTexts();
    const index = texts.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Not found' });
    }
    const [deleted] = texts.splice(index, 1);
    await writeTexts(texts);
    res.json({ success: true, deleted });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete text' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
}); 