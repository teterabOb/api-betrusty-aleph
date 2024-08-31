import express, { Request, Response } from "express";
import { 
    GetAllInfoProtocol, 
    GetInfoGithub, 
    GetInfoMercadoLibre 
} from "../../controller/user/userController";

const app = express();
app.use(express.json());
const router = express.Router();

router.get("/mercadolibre", async (req: Request, res: Response) => {
    await GetInfoMercadoLibre(req, res);
})

router.get("/github", async (req: Request, res: Response) => {
    await GetInfoGithub(req, res);
});

router.get("/all", async (req: Request, res: Response) => {
    await GetAllInfoProtocol(req, res);
});

export default router