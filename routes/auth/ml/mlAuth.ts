import express from "express";
import axios from "axios";
import { Request, Response } from "express";
import { GetMLEnv } from "../../../helpers/data/envData"
import userDBB from "../../dbb/user";
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
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Code or state not found");
  }

  console.log("code", code);
  console.log("state", state);
  
  try {
    // Obtener el token de acceso
    const tokenResponse = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.ML_REDIRECT_URI,
        code_verifier: state
      }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;
    //console.log("access_token", access_token);

    if (!access_token) {
      return res.status(400).send("Access token not found");
    }

    const userResponse = await axios.get(
      "https://api.mercadolibre.com/users/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const userData = userResponse;
    //console.log(userData.data);
    const data = userData.data;

    const { email, seller_reputation } = data;

    // Obtener Info Usuario desde DBB
    console.log("state", state);

    const user = await userDBB.getUserByEmail(state.toString());
    console.log("user", user);

    if (user.rowCount == 0) {
      return res.status(400).send({ message: `Usuario con correo ${code} no encontrado` });
    }

    const userML = await userDBB.getUserMLByEmail(email);

    if(userML.rowCount == 0){ 
      //await userDBB.saveUserML(email, seller_reputation, state.toString());
    }
    //console.log("email", email);
    //console.log("seller_reputation", seller_reputation);
    return res.status(200).send({ message: data });
  } catch (error: any) {
    console.error("Error:", error.response ? error.response.data : error.message);
    return res.status(500).send(error.response ? error.response.data : error.message);
  }
});

/*
async function getInfoMLFromDBB(email: string){
  try {
    const response = await userDBB.getUserMLByEmail(email);
  } catch (error: any) {
    
  }
}
*/

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

router.get("/user-info", async (req: Request, res: Response) => {
  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).send("Access token not found");
  }

  try {
    const userResponse = await axios.get("https://api.mercadolibre.com/users/me", { headers: { Authorization: `token ${access_token}` } });
    const userData = userResponse.data;
    return res.status(200).send(userData);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

export default router;

