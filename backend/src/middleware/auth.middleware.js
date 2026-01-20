import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded.data;
    next();
  
  } catch (err) {
    
    console.error(err);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
