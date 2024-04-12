import jwt from "jsonwebtoken";

export const createToken = (id, expiresIn) => {
  const payload = { id };
  const token = jwt.sign(payload, process.env.JWT_SEcRET, {
    // const token = jwt.sign(payload, JWT_SEcRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (req, res, next) => {
  const token = req.signedCookies["auth_token"];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token not Recieved" });
  }

  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      // return jwt.verify(token, JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token Expired" });
      } else {
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};
