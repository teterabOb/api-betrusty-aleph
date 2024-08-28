import axios, { AxiosResponse } from "axios";
import express, { Request, Response } from "express";
import { GetGitHubEnv } from "../../../helpers/data/envData"
import { Github } from "../../../interfaces/Github";
import userDBB from "../../dbb/user";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = GetGitHubEnv();

const app = express();
app.use(express.json());
const router = express.Router();

// Se debe enviar `worldid_email` en la url
router.get("/login", (req: Request, res: Response) => {
  const { worldid_email } = req.query

  if (!worldid_email) {
    return res.status(400).send({ message: "state custom value not found" });
  }

  const baseUri = "https://github.com/login/oauth/authorize"
  //const clientId = ""
  //const redirectUri = ""
  const finalUri = `${baseUri}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${worldid_email}`
  // Se agrego state al final de la URL, esto se enviará a Github y luego se devolverá en el callback
  const URL = finalUri
  //`https://github.com/login/oauth/authorize?client_id=Iv23liSHZg3lbRlkRrAu&redirect_uri=https://api-betrusty.vercel.app/github/callback&state=${worldid_email}`;
  return res.redirect(URL);
});

router.get("/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;
  console.log("worldid_email", state);

  if (!code || !state) {
    // Aquí tiene que redireccionar a una ruta de error
    //return res.redirect("https://trusthub-ml.vercel.app/error");
    res.status(400).send("Code or state not found");
  }

  try {
    let emailInput = state as string;
    let did = "did1";
    // Obtenemos el token
    const tokenResponse = await getTokenFromGithub(code as string);
    const { access_token, expires_in, refresh_token, refresh_token_expires_in } = tokenResponse;

    const userDataFromGithub = await getUserDataFromGithub(access_token);
    console.log("userDataFromGithub", userDataFromGithub);
    const jsonGithub = GenerateGithubJSON(userDataFromGithub)
    //console.log("jsonGithub", jsonGithub);
    
    const email = userDataFromGithub.email;

    if (!email) {
      return res.status(400).send("Email not found in Github");
    }

    const idUser = await userDBB.getUserByEmail(emailInput);
    //console.log("idUser", idUser);

    if (idUser.rowCount === 0) {
      return res.status(400).send("User not found in Trusthub");
    }

    // Hay que modificar aqui y obtener el Id del Usuario y el DID
    const idUserString = idUser.rows[0].id_user;

    const githubInfoDBB: any = await userDBB.getGithubByUserId(idUserString);

    if (githubInfoDBB.rowCount > 0) {
      await userDBB.updateTokenGithub(idUserString, access_token, expires_in, refresh_token, refresh_token_expires_in, email);
    } else {
      await userDBB.saveTokens(idUserString, did, access_token, expires_in, refresh_token, refresh_token_expires_in, email);
    }

    const baseUrl = `https://trusthub-ml.vercel.app/`
    const url = `${baseUrl}profile?access_token=${access_token}&email=${emailInput}`;
    return res.redirect(url);
  } catch (error) {
    return res.redirect("https://trusthub-ml.vercel.app?error=true");
  }
});

async function getTokenFromGithub(code: string) {
  //https://github.com/login/oauth/access_token?client_id=Iv23liSHZg3lbRlkRrAu&client_secret=44e358abae826ec1afe04c6af842554251a26958&code=1df5c349822e17924679&redirect_uri=https://api-betrusty.vercel.app/github/callback
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

function GenerateGithubJSON(data: any): Github { 
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