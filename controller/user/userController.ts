import express, { Request, Response } from "express";
import userDBB from "../../data/user";
import { getAllInfoProtocol, getGithubInfo, getMercadoLibreInfo } from "../../services/user/user";

export async function GetAllInfoProtocol(req: Request, res: Response) {
    const { id_user } = req.query;

    if (!id_user) return res.status(400).send("id_user not found");

    try {
        const userProfile = await getAllInfoProtocol(id_user.toString());

        if (!userProfile) {
            return res.status(404).send({ message: `User with id ${id_user} not found` });
        }

        return res.status(200).send({ message: userProfile });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}
export async function GetInfoGithub(req: Request, res: Response) {
    const { id_user } = req.query;

    if (!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await getGithubInfo(id_user.toString());
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

export async function GetInfoMercadoLibre(req: Request, res: Response) {
    const { id_user } = req.query;

    if (!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await getMercadoLibreInfo(id_user.toString());
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}