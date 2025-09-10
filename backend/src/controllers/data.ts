import { NextFunction, Request, Response } from "express";
import { SessionRepo } from "../repositories";

export class DataController {
  static handleDataIngress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sessionId, iv, encryptedData } = req.body;

    try {
      // Getting the Target Session
      const targetSessions = await SessionRepo.getBySessionId(sessionId);

      // If Invalid session
      if (targetSessions.length === 0) {
        res.status(404).json({ status: false, msg: " Invalid Session" });
        next();
      }

      await SessionRepo.updateSession(sessionId, null, null, iv, encryptedData);

      res.status(200).json({ status: true, msg: "Data Saved Successfully" });
    } catch (error) {
      res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
  };
  static handleDataEgress = async (req: Request, res: Response) => {};
}
