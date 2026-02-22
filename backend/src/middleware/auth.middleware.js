import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.access_token; 

  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded; 
    next();
  
  } catch (err) {
    
    console.error(err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function emailVerifiedMiddleware(req, res, next) {

  if (!req.user) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  // Verifica se o e-mail foi verificado
  if (!req.user.is_verified) {
    return res.status(403).json({ error: "E-mail não verificado" });
  }

  next();
}

export function adminMiddleware(req, res, next) {

  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  }

  next();
}