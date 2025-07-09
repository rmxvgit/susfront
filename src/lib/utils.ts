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

export function validate_date(
  data: string,
): null | { y: number; m: number; d: number } {
  // shall accept YYYY/MM/DD
  // shall accept YYYY-MM-DD
  const regex = /^(\d{4})[-/](\d{2})[-/](\d{2})$/;
  const parts = data.match(regex);

  if (!parts) {
    return null;
  }

  const y = parseInt(parts[1], 10);
  const m = parseInt(parts[2], 10);
  const d = parseInt(parts[3], 10);

  const date = new Date(y, m - 1, d);

  if (
    date.getFullYear() === y &&
    date.getMonth() + 1 === m &&
    date.getDate() === d
  ) {
    return { y, m, d };
  }

  return null;
}
