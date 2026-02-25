import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

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
        process.env.ACCESS_TOKEN_SECRET_REFRESH,
        (err, payload) => {
          if (err) {
            return res.status(403).json({
              error: "Refresh token inválido ou expirado " + err
            });
          }

          const newAccessToken = jwt.sign(
            {
              id: payload.id,
              role: payload.role || "USER",
              is_verified: payload.is_verified || false
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
          );

          res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction
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