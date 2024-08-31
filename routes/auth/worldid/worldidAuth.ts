import { Router } from "express";
import { Request, Response } from "express";
import { Callback, ValidateAPI, DefaultFunction } from "../../../controller/worldid/worldidController";

const router = Router();

// Endpoint to validate Action
router.get("/validate-api", async (req: Request, res: Response) => {
    await ValidateAPI(req, res);
});

// Endpoint to get the Auth URL
router.get("/", async (req: Request, res: Response) => {
    await DefaultFunction(req, res);
});

// Endpoint to get the Token
router.get("/callback", async (req: Request, res: Response) => {
    await Callback(req, res);   
});

export default router