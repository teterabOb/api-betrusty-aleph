import express, { Request, Response } from "express";
import userDBB from "../dbb/user";
import { UserProfile } from "../../interfaces/UserProfile";

const app = express();
app.use(express.json());
const router = express.Router();

router.get("/mercadolibre", async (req: Request, res: Response) => {
    const { id_user } = req.query

    if (!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await userDBB.getUserMLIdUser(id_user.toString());
        return res.status(200).send(user.rows[0]);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

router.get("/github", async (req: Request, res: Response) => {
    const { id_user } = req.query

    if(!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await userDBB.getGithubByUserId(id_user.toString());
        return res.status(200).send(user.rows[0]);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

router.get("/all", async (req: Request, res: Response) => {
    const { id_user } = req.query

    if(!id_user) return res.status(400).send("id_user not found");

    try {
        const userGithub = await userDBB.getGithubByUserId(id_user.toString());
        if(userGithub.rowCount == 0) return res.status(400).send({ message: `User with id ${id_user} not found` });
        const userGithubData = userGithub.rows[0].data;
        console.log(userGithubData);
        

        const userML = await userDBB.getUserMLIdUser(id_user.toString());
        if(userML.rowCount == 0) return res.status(400).send({ message: `User with id ${id_user} not found` });
        const userMLData = userML.rows[0].data;
        console.log(userMLData);

        const userProfile: UserProfile = {
            reputation_level: "High", // Puedes ajustar esto según tus necesidades
            github_login: userGithubData.github_login,
            github_public_repos: userGithubData.github_public_repos,
            github_public_gists: userGithubData.github_public_gists,
            github_followers: userGithubData.github_followers,
            github_following: userGithubData.github_following,
            github_created_at: userGithubData.github_created_at,
            github_collaborators: userGithubData.github_collaborators,
            mercado_libre_first_name: userMLData.mercado_libre_first_name,
            mercado_libre_last_name: userMLData.mercado_libre_last_name,
            mercado_libre_email: userMLData.mercado_libre_email,
            mercado_libre_identification_number: userMLData.mercado_libre_identification_number,
            mercado_libre_identification_type: userMLData.mercado_libre_identification_type,
            mercado_libre_seller_experience: userMLData.mercado_libre_seller_experience,
            mercado_libre_seller_reputation_transactions_total: userMLData.mercado_libre_seller_reputation_transactions_total,
            mercado_libre_seller_reputation_transactions_completed: userMLData.mercado_libre_seller_reputation_transactions_completed,
            mercado_libre_seller_reputation_transactions_canceled: userMLData.mercado_libre_seller_reputation_transactions_canceled,
            mercado_libre_seller_reputation_ratings_positive: userMLData.mercado_libre_seller_reputation_ratings_positive,
            mercado_libre_seller_reputation_ratings_negative: userMLData.mercado_libre_seller_reputation_ratings_negative,
            mercado_libre_seller_reputation_ratings_neutral: userMLData.mercado_libre_seller_reputation_ratings_neutral,
            mercado_libre_buyer_reputation_canceled_transactions: userMLData.mercado_libre_buyer_reputation_canceled_transactions,
            mercado_libre_buyer_reputation_transactions_total: userMLData.mercado_libre_buyer_reputation_transactions_total,
            mercado_libre_buyer_reputation_transactions_completed: userMLData.mercado_libre_buyer_reputation_transactions_completed,
            mercado_libre_nickname: userMLData.mercado_libre_nickname
        };

        return res.status(200).send(userProfile);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

export default router