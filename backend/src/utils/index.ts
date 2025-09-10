import crypto from "crypto";

export const modPow = (base: bigint, exp: bigint, mod: bigint): string => {
  base %= mod;
  let result = 1n;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result.toString();
};

export const generatePrivateKey = (bytes = 32) =>
  "0x" + crypto.randomBytes(bytes).toString("hex");
