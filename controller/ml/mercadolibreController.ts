import { Request, Response } from "express";
import { getAuthUrl, handleCallback, getUserInfo } from "../../services/ml/mercadolibre";
import { GetWebEnv } from "../../helpers/data/envData";

const { WEB_URL } = GetWebEnv();

export async function Login(req: Request, res: Response) {
    const { worldid_email } = req.query;

    if (!worldid_email) {
        return res.status(400).send({ message: "state custom value not found" });
    }

    try {
        const url = await getAuthUrl(worldid_email as string);
        return res.redirect(url);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

export async function Callback(req: Request, res: Response) {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).send("Code or state not found");
    }

    try {
        const { idUser, email } = await handleCallback(code as string, state as string);
        const url = `${WEB_URL}?id_user=${idUser}&email=${email}`;
        return res.redirect(url);
    } catch (error: any) {
        return res.redirect(`${WEB_URL}error?message=${`Hubo un problema con la autenticación, Favor intenta nuevamente.`}`);
    }
}

export async function GetUserInfo(req: Request, res: Response) {
    const { access_token } = req.query;

    if (!access_token) {
        return res.status(400).send("Access token not found");
    }

    try {
        const userData = await getUserInfo(access_token as string);
        return res.json(userData);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}