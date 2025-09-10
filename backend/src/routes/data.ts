import { Router } from "express";
import { DataController } from "../controllers";

const dataRouter = Router();

dataRouter
  .post("/", DataController.handleDataIngress)
  .get("/", DataController.handleDataEgress);
export { dataRouter };
