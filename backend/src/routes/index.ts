import { Request, Response, Router } from "express";
import { APP_VERSION } from "../configurations";
import { dataRouter } from "./data";
import { diffieHellmanRouter } from "./diffieHellman";

const apiRouter = Router();

apiRouter.get("/ping", (req: Request, res: Response) =>
  res.status(200).json({
    status: true,
    msg: `Server v${APP_VERSION} up and running..`,
  })
);

apiRouter.use("/handshake", diffieHellmanRouter);
apiRouter.use("/data", dataRouter);

export { apiRouter };
