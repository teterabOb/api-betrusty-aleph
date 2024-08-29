import express from "express";
import axios from "axios";
import { Request, Response } from "express";
import { GetMLEnv } from "../../../helpers/data/envData"
import { GetWebEnv } from "../../../helpers/data/envData";
import { MercadoLibre } from "../../../interfaces/MercadoLibre";
import userDBB from "../../dbb/user";
import qs from 'qs';

const router = express.Router();

const {
  ML_CLIENT_ID_CL,
  ML_CLIENT_SECRET_CL,
  ML_REDIRECT_URI_CL,
  ML_CLIENT_ID_AR,
  ML_CLIENT_SECRET_AR,
  ML_REDIRECT_URI_AR
} = GetMLEnv();

const { WEB_URL } = GetWebEnv();


// Punto de entrada para generar el Token de autenticación
router.get("/login", async (req: Request, res: Response) => {
  let { worldid_email, country_code } = req.query;

  if (!worldid_email && !country_code) {
    return res.status(400).send("state custom value or email not sent");
  }

  let countryCode = "";
  let clientId = "";

  if (country_code == "CL") {
    countryCode = ".cl";
    clientId = ML_CLIENT_ID_CL;
    worldid_email = (worldid_email + country_code);

  } else if (country_code == "AR") {
    countryCode = ".com.ar";
    clientId = ML_CLIENT_ID_AR;
    worldid_email = (worldid_email + country_code);
  }

  // Ejemplo Request
  // Correo no valido
  //https://api-betrusty.vercel.app/ml/login?worldid_email=blck@live.cl&country_code=CL
  // Correo valido
  //https://api-betrusty.vercel.app/ml/login?worldid_email=0x2a06572cd2ac0543130e4f6d42b53dc5d4a139d39967acdefc6138ad4553ccae@id.worldcoin.org&country_code=CL

  const mlAuthUrl = `https://auth.mercadolibre${countryCode}/authorization?`
  const finalUrlMl = `${mlAuthUrl}response_type=code&client_id=${clientId}&state=${worldid_email}&redirect_uri=${ML_REDIRECT_URI_CL}`;
  return res.redirect(finalUrlMl);
});

// Callback de la autenticación que consultará Github
router.get("/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Code or state not found");
  }

  const country_code = state.toString().slice(-2)
  const worldid_email = state.toString().slice(0, -2);

  let clientId;
  let clientSecret;
  let redirectUri;

  if(country_code == "CL"){
    clientId = ML_CLIENT_ID_CL;
    clientSecret = ML_CLIENT_SECRET_CL;
    redirectUri = ML_REDIRECT_URI_CL;
  }else if(country_code == "AR"){ 
    clientId = ML_CLIENT_ID_AR;
    clientSecret = ML_CLIENT_SECRET_AR;
    redirectUri = ML_REDIRECT_URI_AR;
  }

  try {
    // Obtener el token de acceso
    const tokenResponse = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
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
    const data = userData.data;
    const objectMercadoLibre: MercadoLibre = GenerateMercadoLibreJSON(data);
    const jsonMercadoLibre = JSON.stringify(objectMercadoLibre);

    const { email } = data;

    const user = await userDBB.getAllDataUserByEmail(worldid_email.toString());

    if (user.rowCount == 0) {
      return res.status(400).send({ message: `Usuario con correo ${worldid_email} no encontrado` });
    }

    const id_user = user.rows[0].id_user;
    const did_user = user.rows[0].did;

    const userML = await userDBB.getUserMLIdUser(id_user.toString());

    if (userML.rowCount == 0) {
      await userDBB.saveUserML(id_user, did_user, jsonMercadoLibre, worldid_email.toString());
    } else {
      await userDBB.updateUserML(id_user, jsonMercadoLibre);
    }

    const baseUrl = WEB_URL//`https://trusthub-ml.vercel.app/`
    const url = `${baseUrl}?id_user=${id_user}&email=${email}`;
    return res.redirect(url);
  } catch (error: any) {
    console.error("Error:", error.response ? error.response.data : error.message);
    return res.status(500).send(error.response ? error.response.data : error.message);
  }
});

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

function GenerateMercadoLibreJSON(data: any): MercadoLibre {

  return {
    mercado_libre_first_name: data.first_name,
    mercado_libre_last_name: data.last_name,
    mercado_libre_email: data.email,
    mercado_libre_identification_number: data.identification.number,
    mercado_libre_identification_type: data.identification.type,
    mercado_libre_seller_experience: data.seller_experience,
    mercado_libre_seller_reputation_transactions_total: data.seller_reputation.transactions.total ?? 0,
    mercado_libre_seller_reputation_transactions_completed: data.seller_reputation.transactions.completed ?? 0,
    mercado_libre_seller_reputation_transactions_canceled: data.seller_reputation.transactions.canceled ?? 0,
    mercado_libre_seller_reputation_ratings_positive: data.seller_reputation.transactions.ratings.positive ?? 0,
    mercado_libre_seller_reputation_ratings_negative: data.seller_reputation.transactions.ratings.negative ?? 0,
    mercado_libre_seller_reputation_ratings_neutral: data.seller_reputation.transactions.ratings.neutral ?? 0,
    mercado_libre_buyer_reputation_canceled_transactions: data.buyer_reputation.transactions.canceled.total ?? 0,
    mercado_libre_buyer_reputation_transactions_total: data.buyer_reputation.transactions.total ?? 0,
    mercado_libre_buyer_reputation_transactions_completed: data.buyer_reputation.transactions.completed ?? 0,
    mercado_libre_nickname: data.nickname,
  }
}

async function saveTokensToDB(accessToken: string, refreshToken: string) {
  // Implementar la lógica para guardar los tokens en la base de datos
}

/*
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
  */

export default router;

