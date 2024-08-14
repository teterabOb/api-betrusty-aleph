import express from "express";
import axios from "axios";
import { Request, Response } from "express";
import { GetGitHubEnv } from "../../../common/helpers/data/envData"

const router = express.Router();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = GetGitHubEnv();

router.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the Protocol API!");
});

router.get("/auth/github", async (_req: Request, res: Response) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(githubAuthUrl);
});

router.get("/auth/github/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code not found");
  }

  try {
    const tokenResponse = await axios.post("",
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
      })

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get("https://api.github.com/user", { headers: { Authorization: `token ${access_token}` } });

    const userData = userResponse.data;
    return res.json(userData);
  } catch (error) {
    return res.status(500).send({ error: "Error duting Github Authentication" });
  }
});

