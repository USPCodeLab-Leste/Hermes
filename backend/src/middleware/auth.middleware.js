import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded.data;
    next();
  
  } catch (err) {
    
    console.error(err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function adminMiddleware(req, res, next) {
  
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  }

  next();
}
