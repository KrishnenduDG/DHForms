import { NextFunction, Request, Response } from "express";
import { SECRET_KEY } from "../configurations";
import { SessionRepo } from "../repositories";
import { aesDecrypt } from "../utils/decryption";

export class DataController {
  static handleDataIngress = async (req: Request, res: Response) => {
    const { sessionId, iv, encryptedData } = req.body;

    try {
      // Getting the Target Session
      const targetSessions = await SessionRepo.getBySessionId(sessionId);

      // If Invalid session
      if (targetSessions.length === 0) {
        res.status(404).json({ status: false, msg: " Invalid Session" });
        return;
      }

      await SessionRepo.updateSession(sessionId, null, null, iv, encryptedData);

      res.status(200).json({ status: true, msg: "Data Saved Successfully" });
    } catch (error) {
      res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
  };

  static handleDataEgress = async (req: Request, res: Response) => {
    const secretKey = req.body.secretKey as string;

    if (secretKey !== SECRET_KEY) {
      res.status(401).json({ status: false, msg: "Access Denied" });
      return;
    }

    try {
      const allSessions = await SessionRepo.getAllSessions();
      const decryptedSessions = [];

      for (let session of allSessions) {
        if (session.encryptionKey && session.encryptedDataBase64) {
          decryptedSessions.push({
            sessionId: session.sessionId,
            data: JSON.parse(
              await aesDecrypt(
                session.encryptionKey!,
                session.ivBase64!,
                session.encryptedDataBase64!
              )
            ),
          });
        }
      }

      res.status(200).json({
        status: true,
        msg: "Data Fetched Successfully",
        data: decryptedSessions,
      });
    } catch (error) {
      res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
  };
}
