import express from "express";
import { Request, Response } from "express";
import { Login, Callback, GetUserInfo } from "../../../controller/ml/mercadolibreController";

const router = express.Router();
//https://api-betrusty.vercel.app/ml/login?worldid_email=blck@live.cl&country_code=CL

// Punto de entrada para generar el Token de autenticación
router.get("/login", async (req: Request, res: Response) => {
  await Login(req, res);
});

// Callback de la autenticación que consultará Github
router.get("/callback", async (req: Request, res: Response) => {
  await Callback(req, res);
});

router.get("/user-info", async (req: Request, res: Response) => {
  await GetUserInfo(req, res);
});




export default router;

