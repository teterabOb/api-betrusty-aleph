import { Request, Response } from "express";
import { getAuthUrl, handleCallback, verifyProofBackEnd } from "../../services/worldid/worldid";
import { ISuccessResult } from '@worldcoin/idkit';

export async function DefaultFunction(req: Request, res: Response) {
    try {
        const url = await getAuthUrl();
        res.status(200).send({ url: url });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

export async function Callback(req: Request, res: Response) {
    const code = req.query.code as string;
    const baseUrl = process.env.WEB_URL || "";

    if (!code || code === "" || !baseUrl) {
        return res.status(400).send({ message: `Code is required ${code} , ${baseUrl}` });
    }

    try {
        const { idUser, userEmail } = await handleCallback(code);
        const url = `${baseUrl}?id_user=${idUser}&email=${userEmail}`;
        return res.redirect(url);
    } catch (error: any) {
        console.log(`error callback wc : ${error.message}`);
        return res.redirect(`${baseUrl}error?message=${`Hubo un problema con la autenticación, Favor intenta nuevamente.`}`);
    }
}

export async function ValidateAPI(req: Request, res: Response) {
    const { proof, signal } = req.body;
    const app_id = process.env.WORLDID_APP_ID || "";
    const action = process.env.WORLDID_ACTION_ID || "";

    try {
        const verifyProofAPI = await verifyProofBackEnd(proof, app_id, action);
        if (!verifyProofAPI.error) {
            res.status(200).send({ message: "succesfully verified", nullifier: verifyProofAPI.nullifier_hash, uses: verifyProofAPI.uses });
        } else {
            res.status(500).send({ message: "WorldID verification failed" });
        }
    } catch (error) {
        res.status(500).send({ message: error });
    }
}