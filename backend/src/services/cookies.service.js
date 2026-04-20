const isProduction = process.env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  domain: isProduction ? ".portalhermes.app" : undefined,
  path: "/"
};

export const cookieOptions = {
  auth: {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 15 // 15 min
  },

  refresh: {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 dias
  }
};