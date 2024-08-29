import express, { Request, Response } from "express";
import userDBB from "../dbb/user";
import { UserProfile } from "../../interfaces/UserProfile";
import { Github } from "../../interfaces/Github";
import { MercadoLibre } from "../../interfaces/MercadoLibre";

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

    if (!id_user) return res.status(400).send("id_user not found");

    try {
        const user = await userDBB.getGithubByUserId(id_user.toString());
        return res.status(200).send(user.rows[0]);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

router.get("/all", async (req: Request, res: Response) => {
    //Si tiene  1 bronce
    // si tiene 2 plata
    const { id_user, } = req.query

    if (!id_user) return res.status(400).send("id_user not found");

    let isGithubConnected: boolean = false;
    let isMlConnected: boolean = false;

    try {
        const userGithub = await userDBB.getGithubByUserId(id_user.toString());
        let userGithubData: Github | null = null
        let userMlData: MercadoLibre | null = null

        if (!(userGithub.rowCount === 0)) {
            userGithubData = userGithub.rows[0].data;
            console.log(userGithubData);
            isGithubConnected = true;
        }
        //return res.status(400).send({ message: `User with id ${id_user} not found` });
        const userML = await userDBB.getUserMLIdUser(id_user.toString());

        if (!(userML.rowCount == 0)) {
            userMlData = userML.rows[0].data;
            console.log(userMlData);
            isMlConnected = true;
        }

        let userProfile: UserProfile | Github | MercadoLibre | null = null

        if (isGithubConnected && !isMlConnected) {
            userProfile = {
                reputation_level: "Bronze", // Puedes ajustar esto según tus necesidades
                github_login: userGithubData!.github_login,
                github_public_repos: userGithubData!.github_public_repos,
                github_public_gists: userGithubData!.github_public_gists,
                github_followers: userGithubData!.github_followers,
                github_following: userGithubData!.github_following,
                github_created_at: userGithubData!.github_created_at,
                github_collaborators: userGithubData!.github_collaborators,
            };
        } else if (!isGithubConnected && isMlConnected) {

            userProfile = {
                reputation_level: "Bronze", // Puedes ajustar esto según tus necesidades            
                mercado_libre_first_name: userMlData!.mercado_libre_first_name,
                mercado_libre_last_name: userMlData!.mercado_libre_last_name,
                mercado_libre_email: userMlData!.mercado_libre_email,
                mercado_libre_identification_number: userMlData!.mercado_libre_identification_number,
                mercado_libre_identification_type: userMlData!.mercado_libre_identification_type,
                mercado_libre_seller_experience: userMlData!.mercado_libre_seller_experience,
                mercado_libre_seller_reputation_transactions_total: userMlData!.mercado_libre_seller_reputation_transactions_total,
                mercado_libre_seller_reputation_transactions_completed: userMlData!.mercado_libre_seller_reputation_transactions_completed,
                mercado_libre_seller_reputation_transactions_canceled: userMlData!.mercado_libre_seller_reputation_transactions_canceled,
                mercado_libre_seller_reputation_ratings_positive: userMlData!.mercado_libre_seller_reputation_ratings_positive,
                mercado_libre_seller_reputation_ratings_negative: userMlData!.mercado_libre_seller_reputation_ratings_negative,
                mercado_libre_seller_reputation_ratings_neutral: userMlData!.mercado_libre_seller_reputation_ratings_neutral,
                mercado_libre_buyer_reputation_canceled_transactions: userMlData!.mercado_libre_buyer_reputation_canceled_transactions,
                mercado_libre_buyer_reputation_transactions_total: userMlData!.mercado_libre_buyer_reputation_transactions_total,
                mercado_libre_buyer_reputation_transactions_completed: userMlData!.mercado_libre_buyer_reputation_transactions_completed,
                mercado_libre_nickname: userMlData!.mercado_libre_nickname
            };
        } else if (isGithubConnected && isMlConnected) {
            userProfile = {
                reputation_level: "Silver", // Puedes ajustar esto según tus necesidades
                github_login: userGithubData!.github_login,
                github_public_repos: userGithubData!.github_public_repos,
                github_public_gists: userGithubData!.github_public_gists,
                github_followers: userGithubData!.github_followers,
                github_following: userGithubData!.github_following,
                github_created_at: userGithubData!.github_created_at,
                github_collaborators: userGithubData!.github_collaborators,
                mercado_libre_first_name: userMlData!.mercado_libre_first_name,
                mercado_libre_last_name: userMlData!.mercado_libre_last_name,
                mercado_libre_email: userMlData!.mercado_libre_email,
                mercado_libre_identification_number: userMlData!.mercado_libre_identification_number,
                mercado_libre_identification_type: userMlData!.mercado_libre_identification_type,
                mercado_libre_seller_experience: userMlData!.mercado_libre_seller_experience,
                mercado_libre_seller_reputation_transactions_total: userMlData!.mercado_libre_seller_reputation_transactions_total,
                mercado_libre_seller_reputation_transactions_completed: userMlData!.mercado_libre_seller_reputation_transactions_completed,
                mercado_libre_seller_reputation_transactions_canceled: userMlData!.mercado_libre_seller_reputation_transactions_canceled,
                mercado_libre_seller_reputation_ratings_positive: userMlData!.mercado_libre_seller_reputation_ratings_positive,
                mercado_libre_seller_reputation_ratings_negative: userMlData!.mercado_libre_seller_reputation_ratings_negative,
                mercado_libre_seller_reputation_ratings_neutral: userMlData!.mercado_libre_seller_reputation_ratings_neutral,
                mercado_libre_buyer_reputation_canceled_transactions: userMlData!.mercado_libre_buyer_reputation_canceled_transactions,
                mercado_libre_buyer_reputation_transactions_total: userMlData!.mercado_libre_buyer_reputation_transactions_total,
                mercado_libre_buyer_reputation_transactions_completed: userMlData!.mercado_libre_buyer_reputation_transactions_completed,
                mercado_libre_nickname: userMlData!.mercado_libre_nickname
            };
        }

        return res.status(200).send(userProfile);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
})

export default router