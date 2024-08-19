import express from "express";
import axios from "axios";
import { Request, Response } from "express";
import { GetGitHubEnv } from "../../../helpers/data/envData"

const router = express.Router();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = GetGitHubEnv();

// Punto de entrada para generar el Token de autenticación
router.get("/", async (_req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(githubAuthUrl);
});

// Callback de la autenticación que consultará Github
router.get("/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== "string" || CLIENT_ID === "" || CLIENT_SECRET === "") {
    return res.status(400).send("Code not found");
  }

  try {
    const tokenResponse = await axios.post("https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      })

    const { access_token } = tokenResponse.data;

    //await saveTokensToDB(accessToken, refreshToken);

    return res.redirect(`/user-info?access_token=${access_token}`);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

// Obtiene la información del Usuario
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

async function saveTokensToDB(accessToken: string, refreshToken: string) {
  // Implementar la lógica para guardar los tokens en la base de datos
}

async function refreshAccessToken(refreshToken: string) {
  // Implementar la lógica para refrescar el token de acceso
  try {
    const tokenResponse = await axios.post("https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        // The refresh token that you received when you generated a user access token.
        refresh_token: "",
      },
      {
        headers: {
          Accept: "application/json",
        },
      })
  } catch (error) {

  }
}

export default router;

