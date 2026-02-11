import jwt from "jsonwebtoken";

class JwtController {

  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return res.status(401).json({
          error: "Refresh token não fornecido"
        });
      }

      jwt.verify(
        refreshToken,
        process.env.ACCESS_TOKEN_REFRESH_SECRET,
        (err, payload) => {
          if (err) {
            return res.status(403).json({
              error: "Refresh token inválido ou expirado"
            });
          }

          const newAccessToken = jwt.sign(
            {
              id: payload.id,
              role: payload.role || "USER"
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
          );

          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false // true em produção
          });

          return res.status(200).json({
            message: "Access token renovado com sucesso"
          });
        }
      );

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno ao renovar token" });
    }
  }

}

export default new JwtController();