export interface IHandshakeData {
  sessionId: null | string
  g: null | string
  p: null | string
  clientPrivateKey: null | string
  clientPubKey: null | string
  serverPubKey: null | string
  finalEncryptionKey: null | string
}

export interface IFormData {
  [key: string]: string
}
