import exp from "constants";
import express, { Request, Response } from "express"; 

const app = express();
app.use(express.json());    
const router = express.Router();

router.get("/mercadolibre", async (req: Request, res: Response) => { 
    const { id_user } = req.query
})

router.get("/github", async (req: Request, res: Response) => { 
    const { id_user } = req.query
})

router.get("/all", async (req: Request, res: Response) => { 
    const { id_user } = req.query
})