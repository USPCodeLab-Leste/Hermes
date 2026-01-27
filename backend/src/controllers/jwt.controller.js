import jwt from "jsonwebtoken";

class eventsController {

  async refresh(req, res) {
    const token = req.cookie.token;

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, user) => {

      if(err && err !== "TokenExpiredError") return res.sendStatus(403);

      const newToken = jwt.sign(
        {
          data:{
            id: user.id,
            role: user.role || "USER"
          }
        },
        process.env.ACESS_TOKEN_SECRET_REFRESH,
        {
          expiresIn: "1h"
        }
      );

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: false,   // true - em produção
        sameSite: "lax"
      });

      res.status(200).json({ message: "Token atualizado" });

    })



  }
  
}

export default new eventsController();