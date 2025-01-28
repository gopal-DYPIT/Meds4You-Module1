import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Ensure authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or Invalid Token Format" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token Not Found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token Verification Error:", err);

      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Forbidden: Token Expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Forbidden: Invalid Token" });
      } else {
        return res
          .status(403)
          .json({ message: "Forbidden: Authentication Failed" });
      }
    }

    req.user = decoded; // Attach decoded user data to request
    // console.log(req.user);
    return next(); // Proceed to the next middleware
  });
};
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const isAllowed = allowedRoles.includes(req.user.role);
    if (!isAllowed) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export  {authenticateToken, authorizeRoles};
