import express, { Request, Response } from "express";
import { Callback, GetUserInfo, Login } from "../../../controller/github/githubController";

const app = express();
app.use(express.json());
const router = express.Router();

// Se debe enviar `worldid_email` en la url
router.get("/login", async (req: Request, res: Response) => {
  await Login(req, res);
});

router.get("/callback", async (req: Request, res: Response) => {
  await Callback(req, res);
});

router.get("/user-info", async (req: Request, res: Response) => {
  await GetUserInfo(req, res);
});

export default router;