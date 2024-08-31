import userDBB from '../../data/user';
import { UserProfile } from '../../interfaces/UserProfile';
import { Github } from '../../interfaces/Github';
import { MercadoLibre } from '../../interfaces/MercadoLibre';

export async function getAllInfoProtocol(id_user: string): Promise<UserProfile | Github | MercadoLibre | null> {
    let isGithubConnected: boolean = false;
    let isMlConnected: boolean = false;

    try {
        const userGithub = await userDBB.getGithubByUserId(id_user);
        let userGithubData: Github | null = null;
        let userMlData: MercadoLibre | null = null;

        if (userGithub.rowCount! > 0) {
            userGithubData = userGithub.rows[0].data;
            isGithubConnected = true;
        }

        const userML = await userDBB.getUserMLIdUser(id_user);

        if (userML.rowCount! > 0) {
            userMlData = userML.rows[0].data;
            isMlConnected = true;
        }

        let userProfile: UserProfile | Github | MercadoLibre | null = null;

        if (isGithubConnected && !isMlConnected) {
            userProfile = {
                reputation_level: "Bronze", // Puedes ajustar esto según tus necesidades
                github_login: String(userGithubData!.github_login),
                github_public_repos: String(userGithubData!.github_public_repos),
                github_public_gists: String(userGithubData!.github_public_gists),
                github_followers: String(userGithubData!.github_followers),
                github_following: String(userGithubData!.github_following),
                github_created_at: String(userGithubData!.github_created_at),
                github_collaborators: String(userGithubData!.github_collaborators),
            };
        } else if (!isGithubConnected && isMlConnected) {
            userProfile = {
                reputation_level: "Bronze", // Puedes ajustar esto según tus necesidades            
                mercado_libre_first_name: String(userMlData!.mercado_libre_first_name),
                mercado_libre_last_name: String(userMlData!.mercado_libre_last_name),
                mercado_libre_email: String(userMlData!.mercado_libre_email),
                mercado_libre_identification_number: String(userMlData!.mercado_libre_identification_number),
                mercado_libre_identification_type: String(userMlData!.mercado_libre_identification_type),
                mercado_libre_seller_experience: String(userMlData!.mercado_libre_seller_experience),
                mercado_libre_seller_reputation_transactions_total: String(userMlData!.mercado_libre_seller_reputation_transactions_total),
                mercado_libre_seller_reputation_transactions_completed: String(userMlData!.mercado_libre_seller_reputation_transactions_completed),
                mercado_libre_seller_reputation_transactions_canceled: String(userMlData!.mercado_libre_seller_reputation_transactions_canceled),
                mercado_libre_seller_reputation_ratings_positive: String(userMlData!.mercado_libre_seller_reputation_ratings_positive),
                mercado_libre_seller_reputation_ratings_negative: String(userMlData!.mercado_libre_seller_reputation_ratings_negative),
                mercado_libre_seller_reputation_ratings_neutral: String(userMlData!.mercado_libre_seller_reputation_ratings_neutral),
                mercado_libre_buyer_reputation_canceled_transactions: String(userMlData!.mercado_libre_buyer_reputation_canceled_transactions),
                mercado_libre_buyer_reputation_transactions_total: String(userMlData!.mercado_libre_buyer_reputation_transactions_total),
                mercado_libre_buyer_reputation_transactions_completed: String(userMlData!.mercado_libre_buyer_reputation_transactions_completed),
                mercado_libre_nickname: String(userMlData!.mercado_libre_nickname)
            };
        } else if (isGithubConnected && isMlConnected) {
            userProfile = {
                reputation_level: "Silver", // Puedes ajustar esto según tus necesidades
                github_login: String(userGithubData!.github_login),
                github_public_repos: String(userGithubData!.github_public_repos),
                github_public_gists: String(userGithubData!.github_public_gists),
                github_followers: String(userGithubData!.github_followers),
                github_following: String(userGithubData!.github_following),
                github_created_at: String(userGithubData!.github_created_at),
                github_collaborators: String(userGithubData!.github_collaborators),
                mercado_libre_first_name: String(userMlData!.mercado_libre_first_name),
                mercado_libre_last_name: String(userMlData!.mercado_libre_last_name),
                mercado_libre_email: String(userMlData!.mercado_libre_email),
                mercado_libre_identification_number: String(userMlData!.mercado_libre_identification_number),
                mercado_libre_identification_type: String(userMlData!.mercado_libre_identification_type),
                mercado_libre_seller_experience: String(userMlData!.mercado_libre_seller_experience),
                mercado_libre_seller_reputation_transactions_total: String(userMlData!.mercado_libre_seller_reputation_transactions_total),
                mercado_libre_seller_reputation_transactions_completed: String(userMlData!.mercado_libre_seller_reputation_transactions_completed),
                mercado_libre_seller_reputation_transactions_canceled: String(userMlData!.mercado_libre_seller_reputation_transactions_canceled),
                mercado_libre_seller_reputation_ratings_positive: String(userMlData!.mercado_libre_seller_reputation_ratings_positive),
                mercado_libre_seller_reputation_ratings_negative: String(userMlData!.mercado_libre_seller_reputation_ratings_negative),
                mercado_libre_seller_reputation_ratings_neutral: String(userMlData!.mercado_libre_seller_reputation_ratings_neutral),
                mercado_libre_buyer_reputation_canceled_transactions: String(userMlData!.mercado_libre_buyer_reputation_canceled_transactions),
                mercado_libre_buyer_reputation_transactions_total: String(userMlData!.mercado_libre_buyer_reputation_transactions_total),
                mercado_libre_buyer_reputation_transactions_completed: String(userMlData!.mercado_libre_buyer_reputation_transactions_completed),
                mercado_libre_nickname: String(userMlData!.mercado_libre_nickname)
            };
        }

        return userProfile;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGithubInfo(id_user: string) {
    try {
        const user = await userDBB.getGithubByUserId(id_user);
        return user.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching GitHub info from Vercel");
    }
}

export async function getMercadoLibreInfo(id_user: string) {
    try {
        const user = await userDBB.getUserMLIdUser(id_user);
        return user.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching MercadoLibre info from Vercel");
    }
}