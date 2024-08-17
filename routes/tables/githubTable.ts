import { sql } from "@vercel/postgres";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// A esta ruta se le llama para crear la tabla de usuarios
// Solo UNA vez
router.get("/", async (_req: Request, res: Response) => {
    try {
        const result = await sql`CREATE TABLE 
        Github(
        ID_USER BIGINT, 
        DID VARCHAR(150),
        ACCESS_TOKEN VARCHAR(150), 
        EXPIRES_IN VARCHAR(150), 
        REFRESH_TOKEN VARCHAR(150), 
        REFRESH_TOKEN_EXPIRES_IN VARCHAR(150), 
        EMAIL VARCHAR(150),
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;