import express from "express";
import axios from "axios";
import { Request, Response } from "express";
import { GetMLEnv } from "../../../helpers/data/envData"
import qs from 'qs';

const router = express.Router();

const {
  ML_CLIENT_ID,
  ML_CLIENT_SECRET,
  ML_REDIRECT_URI
} = GetMLEnv();

// Punto de entrada para generar el Token de autenticación
router.get("/login", async (req: Request, res: Response) => {
  const { worldid_email, country_code } = req.query;

  if (!worldid_email) {
    return res.status(400).send("state custom value not found");
  }

  let countryCode = "";

  if (country_code == "CL") {
    countryCode = ".cl";
  } else if (country_code == "AR") {
    countryCode = ".com.ar";
  } else {
    countryCode = ".cl";
  }

  // Ejemplo Request
  //http://localhost:3000/ml/login?worldid_email=blck@live.cl&country_code=CL
  //https://api-betrusty.vercel.app/ml/login?worldid_email=blck@live.cl&country_code=CL

  //https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=$APP_ID&state=ABC123&redirect_uri=$REDIRECT_URL
  const mlAuthUrl = `https://auth.mercadolibre${countryCode}/authorization?`
  const finalUrlMl = `${mlAuthUrl}response_type=code&client_id=${ML_CLIENT_ID}&state=${worldid_email}&redirect_uri=${ML_REDIRECT_URI}`;
  //const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${worldid_email}`;
  return res.redirect(finalUrlMl);
});

// Callback de la autenticación que consultará Github
router.get("/callback", async (req: Request, res: Response) => {
  //console.log("ENTRAAA AL CALLBACK");

  const { code, state } = req.query;
  console.log("worldid_email", state);
  console.log("code", code);

  if (code === "" || state === "") {
    // Aqui tiene que redireccionar a una ruta de error
    //return res.redirect("/error");
    return res.status(400).send("Code or state not found");
  }

  console.log("ML_CLIENT_ID", ML_CLIENT_ID);
  console.log("ML_CLIENT_SECRET", ML_CLIENT_SECRET);
  console.log("ML_REDIRECT_URI", ML_REDIRECT_URI);
  console.log("code", code);
  
  try {
    const tokenResponse = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: ML_CLIENT_ID,
        client_secret: ML_CLIENT_SECRET,
        code: code,
        redirect_uri: ML_REDIRECT_URI,
        code_verifier: state
      }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

    const { access_token } = tokenResponse.data;

    try {
      const userResponse = await axios.get(
        "https://api.github.com/users/me", 
        { headers: { Authorization: `Bearer ${access_token}` } 
      });
      const userData = userResponse.data;
      console.log("USER RESPONSE");
      console.log("userResponse", userResponse);
      console.log("USER DATA");
      console.log("userData", userData);
      
      //return res.json(userData);
    } catch (error) {
      return res.status(500).send({ error: "Error obteniendo la info del usuario" });
    }
    //await saveTokensToDB(accessToken, refreshToken);

    console.log("access_token", tokenResponse.data);
    //const baseUrl = `https://trusthub-ml.vercel.app/`
    //const url = `${baseUrl}profile?access_token=${access_token}&email=${state}`;

    return res.status(200).send(tokenResponse);
    //return res.redirect(`/user-info?access_token=${access_token}`);
    //return res.redirect(`https://trusthub-ml.vercel.app?access_token=${access_token}&email=${state}`);
  } catch (error: any) {
    const errorDescription = error.response.data || error;
    return res.status(500).send( errorDescription );
    //return res.status(500).send({ error: "Error al obtener la información de Github" });
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
});

async function getUserDataFromGithub(accessToken: string) {
  // Implementar la lógica para obtener la información del usuario
  try {
    const userResponse = await axios.get(
      "https://api.github.com/user",
      {
        headers:
          { Authorization: `token ${accessToken}` }
      });
    return userResponse.data;
  } catch (error) {
    throw error;
  }
}

async function saveTokensToDB(accessToken: string, refreshToken: string) {
  // Implementar la lógica para guardar los tokens en la base de datos
}

async function refreshAccessToken(refreshToken: string) {
  // Implementar la lógica para refrescar el token de acceso
  try {
    const tokenResponse = await axios.post("https://github.com/login/oauth/access_token",
      {
        client_id: ML_CLIENT_ID,
        client_secret: ML_CLIENT_SECRET,
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

