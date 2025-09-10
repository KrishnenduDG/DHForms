import { Router } from "express";
import { DiffieHellmanController } from "../controllers";

const diffieHellmanRouter = Router();

diffieHellmanRouter
  .get("/sec-exchange", DiffieHellmanController.handleInitialSecretExchange)
  .post(
    "/client-pubKey-ingestion",
    DiffieHellmanController.handleClientPublicKeyIngestion
  );

export { diffieHellmanRouter };
