import { sql } from "@vercel/postgres";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();

// A esta ruta se le llama para crear la tabla de usuarios
// Solo UNA vez
router.get("/", async (_req: Request, res: Response) => {
    try {
        const result = await sql`CREATE TABLE 
        Users(
        ID_USER SERIAL PRIMARY KEY, 
        DID VARCHAR(50),
        NAME VARCHAR(50), 
        EMAIL VARCHAR(50), 
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get("/drop-table", async (_req: Request, res: Response) => {
    try {
        const result = await sql`DROP TABLE Users`;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})



export default router;