import jwt from "jsonwebtoken";

export const createToken = async (id, expiresIn) => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(payload, process.env.JWT_SEcRET, { expiresIn }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyToken = async (req, res, next) => {
  const token = req.signedCookies["auth_token"];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token not Received" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtData = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token Expired" });
  }
};
