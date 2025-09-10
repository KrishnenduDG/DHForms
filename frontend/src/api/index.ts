import axios from 'axios'
import {
  getInitHandshakeSecretsEndpoint,
  sendClientPublicKeyEndpoint,
  sendEncryptedDataEndpoint,
} from './constants'

export class APIService {
  static getInitHandshakeSecrets = async () =>
    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${getInitHandshakeSecretsEndpoint}`)

  static sendClientPublicKey = async (sessionId: string, pubKey: string) =>
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${sendClientPublicKeyEndpoint}`, {
      sessionId,
      pubKey,
    })

  static sendEncryptedData = async (payload: Object) =>
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${sendEncryptedDataEndpoint}`, payload)
}
