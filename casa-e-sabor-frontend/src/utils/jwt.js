// src/utils/jwt.js
export function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const json = window.atob(base64Payload);
    return JSON.parse(json);
  } catch (e) {
    console.error("Erro ao fazer parse do JWT:", e);
    return null;
  }
}
