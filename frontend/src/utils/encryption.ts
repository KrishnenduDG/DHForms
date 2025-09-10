const derive256bitKey = async (sharedSecret: string) =>
  crypto.subtle.importKey(
    'raw',
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sharedSecret)),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )

export const aesEncrypt = async (
  sharedSecret: string,
  plaintext: string,
): Promise<{
  iv: Uint8Array
  cipherText: Uint8Array
}> => {
  // Derive AES key from shared secret
  const aesKey = await derive256bitKey(sharedSecret)

  // Generate random IV (12 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encode plaintext to Uint8Array
  const encoded = new TextEncoder().encode(plaintext)

  // Encrypt using AES-GCM
  const ciphertextBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded)

  return {
    iv,
    cipherText: new Uint8Array(ciphertextBuffer),
  }
}
