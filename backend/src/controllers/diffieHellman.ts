import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { G_FOR_DH, P_FOR_DH } from "../configurations";
import { SessionRepo } from "../repositories";
import { generatePrivateKey, modPow } from "../utils";

export class DiffieHellmanController {
  static handleInitialSecretExchange = async (req: Request, res: Response) => {
    const serverPrivateKey = generatePrivateKey();

    const serverPubKey = modPow(
      BigInt(G_FOR_DH),
      BigInt(serverPrivateKey),
      BigInt(P_FOR_DH)
    ).toString();

    try {
      // Adding to DB
      const [{ sessionId }] = await SessionRepo.addSession(
        serverPrivateKey,
        serverPubKey
      );

      res.status(201).json({
        status: true,
        msg: "Session Init Done",
        data: {
          sessionId,
          p: P_FOR_DH,
          g: G_FOR_DH,
          serverPubKey,
        },
      });
    } catch (error) {
      res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
  };

  static handleClientPublicKeyIngestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sessionId, pubKey } = req.body;

    try {
      // Getting the Target Session
      const targetSessions = await SessionRepo.getBySessionId(sessionId);

      // If Invalid session
      if (targetSessions.length === 0) {
        res.status(404).json({ status: false, msg: " Invalid Session" });
        next();
      }

      const encryptionKey = modPow(
        BigInt(pubKey),
        BigInt(targetSessions[0].serverPrivateKey as string),
        BigInt(P_FOR_DH)
      ).toString();

      SessionRepo.updateSession(sessionId, pubKey, encryptionKey);

      res.status(200).json({ status: true, msg: "Handshake Complete!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
  };
}
