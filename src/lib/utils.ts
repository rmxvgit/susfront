import jwt from "jsonwebtoken";

export function is_token_expired(token: string): boolean {
  const decoded = jwt.decode(token, { complete: true });

  if (
    !decoded ||
    !decoded.payload ||
    typeof decoded.payload == "string" ||
    !decoded.payload.exp
  ) {
    return true; // Consider expired if no expiration time
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.payload.exp < currentTime;
}
