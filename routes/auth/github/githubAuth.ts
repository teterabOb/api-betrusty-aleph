import axios, { AxiosResponse } from "axios";
import { Request, Response, Router } from "express";
import { GetGitHubEnv } from "../../../helpers/data/envData"
import userDBB from "../../dbb/user";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = GetGitHubEnv();

const router = Router();

router.get("/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code not found");
  }

  try {
    // Obtenemos el token
    const tokenResponse = await getTokenFromGithub(code as string);
    const { access_token, expires_in, refresh_token, refresh_token_expires_in } = tokenResponse;

    // Validamos si el usuario ya existe en la base de datos
    // Este ID debemos obtenerlo con el DID
    // Cuando el usuario inicia sesion guardaremos data 
    // En todas las tablas para asegurar el DID y el ID_USER
    const userDataFromDBB = await userDBB.getUser("1");
    console.log("userDataFromDBB : ", userDataFromDBB);

    if (userDataFromDBB.rowCount === 0) {
      await userDBB.saveUser("did1", "test name", "test email");
    }

    const userDataFromGithub = await getUserDataFromGithub(access_token);
    const email = userDataFromGithub.email;

    if (!email) {
      return res.status(400).send("Email not found");
    }

    const githubInfoDBB: any = await userDBB.getGithubByEmail(email);
    console.log("githubInfoDBB : ", githubInfoDBB);


    if (githubInfoDBB.rowCount > 0) {
      await userDBB.updateToken(githubInfoDBB.rows[0].id_user, access_token, expires_in, refresh_token, refresh_token_expires_in, email);
    } else {
      await userDBB.saveTokens("1", access_token, expires_in, refresh_token, refresh_token_expires_in, email);
    }

    return res.status(200).json(tokenResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

async function getTokenFromGithub(code: string) {
  try {
    const response = await axios.post("https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      });

    return response.data;
  } catch (error) {
    throw new Error("Error fetching token from GitHub");
  }
}

async function getUserDataFromGithub(access_token: string) {
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

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
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


router.get("/user-info", async (req: Request, res: Response) => {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).send("Access token not found");
  }

  try {
    const userResponse = await axios.get("https://api.github.com/user", { headers: { Authorization: `token ${access_token}` } });
    const userData = userResponse.data;
    return res.json(userData);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
})

export default router;