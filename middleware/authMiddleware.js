const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');  
  console.log('Token: ' + token);

  const berearWord = token.split(' ')[0];
  const berearToken = token.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(berearToken, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).json({ msg: err });
  }
};

module.exports = { auth };
