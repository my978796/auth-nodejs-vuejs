const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};
