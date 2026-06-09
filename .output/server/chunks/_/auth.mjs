import { f as setCookie, g as getCookie, h as getRequestHeader } from './nitro.mjs';

const TOKEN_COOKIE = "kenwa_token";
function getTokenFromRequest(event) {
  const cookie = getCookie(event, TOKEN_COOKIE);
  if (cookie) return cookie;
  const auth = getRequestHeader(event, "authorization");
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  return type === "Bearer" ? token : null;
}
function attachTokenCookie(event, token) {
  setCookie(event, TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}
function clearTokenCookie(event) {
  setCookie(event, TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
}

export { attachTokenCookie as a, clearTokenCookie as c, getTokenFromRequest as g };
//# sourceMappingURL=auth.mjs.map
