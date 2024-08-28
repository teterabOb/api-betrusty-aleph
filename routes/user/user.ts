import express, { Request, Response } from "express";
import userDBB from "../dbb/user";

const app = express();
app.use(express.json());
const router = express.Router();

router.get("/mercadolibre", async (req: Request, res: Response) => {
    const { id_user } = req.query

    if (!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await userDBB.getUserMLIdUser(id_user.toString());
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

router.get("/github", async (req: Request, res: Response) => {
    const { id_user } = req.query

    if(!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await userDBB.getGithubByUserId(id_user.toString());
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

router.get("/all", async (req: Request, res: Response) => {
    const { id_user } = req.query
    
})