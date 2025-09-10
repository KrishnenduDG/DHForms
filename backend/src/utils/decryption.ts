import { webcrypto } from "crypto";
const { subtle } = webcrypto;

const fromBase64 = (b64: string): Uint8Array =>
  new Uint8Array(Buffer.from(b64, "base64"));

const derive256bitKey = async (sharedSecret: string) =>
  subtle.importKey(
    "raw",
    await subtle.digest("SHA-256", new TextEncoder().encode(sharedSecret)),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

export const aesDecrypt = async (
  sharedSecret: string,
  iv: string,
  cipherText: string
): Promise<string> => {
  const aesKey = await derive256bitKey(sharedSecret);

  const decryptedBuffer = await subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(iv) },
    aesKey,
    fromBase64(cipherText)
  );

  return new TextDecoder().decode(decryptedBuffer); // Convert to string
};
