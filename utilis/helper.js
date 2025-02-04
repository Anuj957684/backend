const getBaseUrl = () => {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`;
  };





  const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: 401, message: "Unauthorized. Token missing." });
    }
  
    try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log(decoded);
        
      req.user = decoded; 
      next();
    } catch (err) {
      return res.status(401).json({ status: 401, message: "Unauthorized. Invalid token." });
    }
  };
  
module.exports = {
    getBaseUrl,
    authenticateToken
}