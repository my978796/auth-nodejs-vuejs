const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: require('path').resolve(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
