import axios, { AxiosResponse } from "axios";
import { GetGitHubEnv } from "../../helpers/data/envData";
import { Github } from "../../interfaces/Github";
import userDBB from "../../data/user";

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
}

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = GetGitHubEnv();

export async function getAuthUrl(worldid_email: string): Promise<string> {
    const baseUri = "https://github.com/login/oauth/authorize";
    return `${baseUri}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${worldid_email}`;
}

export async function handleCallback(code: string, state: string): Promise<{ idUser: string, email: string }> {
    const tokenResponse = await getTokenFromGithub(code);
    const { access_token, expires_in, refresh_token, refresh_token_expires_in } = tokenResponse;

    const userDataFromGithub = await getUserDataFromGithub(access_token);
    const objectGithub: Github = generateGithubJSON(userDataFromGithub);
    const jsonGithub = JSON.stringify(objectGithub);

    const email = userDataFromGithub.email;

    if (!email) {
        throw new Error("Email not found in Github");
    }

    const idUser = await userDBB.getUserByEmail(state);

    if (idUser.rowCount === 0) {
        throw new Error("User not found in Trusthub");
    }

    const idUserString = idUser.rows[0].id_user;
    const githubInfoDBB: any = await userDBB.getGithubByUserId(idUserString);

    if (githubInfoDBB.rowCount > 0) {
        await userDBB.updateTokenGithub(idUserString, access_token, expires_in, refresh_token, refresh_token_expires_in, email, jsonGithub);
    } else {
        await userDBB.saveTokens(idUserString, "did1", access_token, expires_in, refresh_token, refresh_token_expires_in, email, jsonGithub);
    }

    return { idUser: idUserString, email: state };
}

export async function getUserInfo(access_token: string): Promise<any> {
    const userResponse = await axios.get("https://api.github.com/user", { headers: { Authorization: `token ${access_token}` } });
    return userResponse.data;
}

export async function getTokenFromGithub(code: string): Promise<TokenResponse> {
    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: REDIRECT_URI,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw new Error("Failed to fetch access token");
    }
}

async function getUserDataFromGithub(access_token: string): Promise<any> {
    try {
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error("Error fetching user data from GitHub");
    }
}

function generateGithubJSON(data: any): Github {
    return {
        github_login: data.login,
        github_public_repos: data.public_repos,
        github_public_gists: data.public_gists,
        github_followers: data.followers,
        github_following: data.following,
        github_created_at: data.created_at,
        github_collaborators: data.collaborators,
    }
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    try {
        const response: AxiosResponse<TokenResponse> = await axios.post("https://github.com/login/oauth/access_token",
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            });

        return response.data;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
}