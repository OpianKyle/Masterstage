import { Router, type IRouter } from "express";
import portalRouter from "./portal";

const router: IRouter = Router();

router.use("/portal", portalRouter);

export default router;
