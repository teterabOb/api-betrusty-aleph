import { Router } from "express";
import { Request, Response } from "express";
import { type ISuccessResult } from '@worldcoin/idkit'
import { GetWorldIDEnv } from "../../../helpers/data/envData";
import userDBB from "../../dbb/user";
import axios from 'axios';
import qs from 'qs';

const router = Router();

const { WORLD_ID,
    WORLD_SECRET,
    WORLD_REDIRECT_URI,
    WORLDID_TOKEN_URL,
    WORLDID_BASIC_TOKEN  } = GetWorldIDEnv();

// Endpoint to validate Action
router.get("/validate-api", async (req: Request, res: Response) => {
    const { proof, signal } = req.body;
    const app_id = process.env.WORLDID_APP_ID || "";
    const action = process.env.WORLDID_ACTION_ID || "";

    const verifyProofAPI = await verifyProofBackEnd(proof, app_id, action);
    if (!verifyProofAPI.error) {
        res.status(200).send({ message: "succesfully verified", nullifier: verifyProofAPI.nullifier_hash, uses: verifyProofAPI.uses });
    } else {
        res.status(500).send({ message: "WorldID verification failed" });
    }
});

// Endpoint to get the Auth URL
router.get("/", async (req: Request, res: Response) => {
    const response_type = "code";
    const redirect_uri = WORLD_REDIRECT_URI;
    const scope = "openid+profile+email";
    const client_id = WORLD_ID;
    const world_id_endpoint = "https://worldcoin.org/oauth/authorize";

    const url = `${world_id_endpoint}?response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}&client_id=${client_id}`

    res.status(200).send({ url: url });
});

// Endpoint to get the Token
router.get("/callback", async (req: Request, res: Response) => {
    const endpoint = "https://id.worldcoin.org/token"
    const code = req.query.code;
    const baseUrl = `https://trusthub-ml.vercel.app/`

    const grant_type = "authorization_code"
    const redirect_uri = WORLD_REDIRECT_URI;

    if (!code || code === "" || redirect_uri === "") {
        return res.status(400).send({ message: `Code is required ${code} , ${redirect_uri}` });
    }

    try {
        const response = await axios.post(endpoint,
            qs.stringify({
                code: code,
                grant_type: grant_type,
                redirect_uri: WORLD_REDIRECT_URI
            }),
            {
                headers: {
                    'Authorization': `Basic ${WORLDID_BASIC_TOKEN}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            },
        )

        const { access_token, token_type, expires_in, scope, id_token } = response.data;

        // Aqui debo guardar la informacion del usuario en la base de datos
        let userEmail: string = ""
        userEmail = await getUserInfo(access_token, token_type);

        if (userEmail === "") {
            return res.status(400).send({ message: "Error fetching user data from WorldID, empty Email" });
        }

        // Verificar si el usuario ya existe en la BDD
        const user = await userDBB.getUserByEmail(userEmail);

        let idUser: string = "";

        // Validamos que la consulta nos devuelva un usuario
        if (user.rowCount === 0) {
            // Aqui guardar al usuario en la BDD
            const insertUser = await userDBB.saveUser("did1", "anon", userEmail);
            // Obtenemos la info del Usuario recien insertado
            const user = await userDBB.getUserByEmail(userEmail);
            // Validamos que haya retornado un usuario
            console.log("user", user);

            if (user.rowCount === 0) {
                return res.status(400).send({ message: "Error saving user in DB" });
            }
            // Asignamos el ID del usuario
            idUser = user.rows[0].id_user;
            // No retorna nada, luego se puede borrar, si falla cae al catch
            const saveTokensWID =
                await userDBB.saveTokensWorldID(idUser.toString(),
                    access_token,
                    token_type,
                    expires_in,
                    scope,
                    id_token,
                    userEmail
                );
        } else {
            // No retorna nada, luego se puede borrar, si falla cae al catch
            const updateTokensWID =
                await userDBB.updateTokenWorldID(
                    idUser.toString(),
                    access_token,
                    token_type,
                    expires_in,
                    scope,
                    id_token);
        }

        // Retornamos el mensaje de usuario verificado
        // *************************************
        // AQUI REDIRIGIR A LA PAGINA DE LA APP
        // *************************************
        const baseUrl = `https://trusthub-ml.vercel.app/`
        const url = `${baseUrl}profile?access_token=${access_token}&email=${userEmail}`;
        return res.redirect(url);
    } catch (error: any) {
        const errorDescription = error.response.data || error;
        return res.redirect(`${baseUrl}error?error=${errorDescription.error_description}`);
    }
});

// User Info

// Para crear el Token se debe ecodear el client_id y el client_secret en base64
router.get("/get-user-info", async (req: Request, res: Response) => {

});

const getUserInfo = async (access_token: string, token_type: string) => {
    let userEmail: string = "";
    try {
        const endpoint_user_info = "https://id.worldcoin.org/userinfo";

        const requestGetUserInfo = await axios.post(
            endpoint_user_info,
            {},
            {
                headers: {
                    'Authorization': `${token_type} ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            },
        )

        //console.log("requestGetUserInfo", requestGetUserInfo.data.email);
        userEmail = requestGetUserInfo.data.email;
    } catch (error) {
        //console.log("error", error);
        throw new Error("Error fetching user data from WorldID");
    } finally {
        return userEmail;
    }
}

// This is for App Actions Verification
/*  Esto se utiliza para verificar las acciones de App Actions
    Tiene unos datos hardcodeados, no la utilizamos ahora pero quedaron
    las pruebas de como se hace
 */
const verifyProofBackEnd = async (proof: ISuccessResult, appId: string, action: string) => {
    const apiUrl = `https://developer.worldcoin.org/api/v2/verify/${appId}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            verification_level: "orb",
            proof: "0x2f87a182565d7f0abb1d1081f4cc973be1f925d85989fbdf5ce1ace2425093300d375b6cc334454cfe523a2fbb241b4398ab030dd45511ed6fad37479de74d652cee36009b77eed79bdf5a2fb4b1a1d8e967c05dbf50d36310088c1cbe3d9010055c799ef6e8677930b674034201355652a0e55e32e73835168b916847a8d93e2ef361a894c328b1090bc131408301a8d794eb0eb78ef682a75c500e3e7ef2e61b46107f365809c857c70afcf9e51225e0cdb5803074b2df2f0288166ee5b42d01f76ba6a75f7bf50969b1501cc8222b3718d2c75e6a2c9fa4481e271f18cf080fcddabef0e3202298911d897ab1367a3e55252679c8f8985f9b541e7f6bb344",
            merkle_root: "0x29bfd71235061ae4317ac1fee537077fe96ee8fe8f4375ab434c18aa3a880ded",
            nullifier_hash: "0x04a74bd57677629286c6e13289c00029dc776595eb368382ccc69d65b604a0ad",
            credential_type: "orb",
            action: action
        }),
    })

    if (response.ok) {
        const respVerification = await response.json();
        console.log('response', respVerification);

        return { error: false, nullifier_hash: respVerification.nullifier_hash, uses: respVerification.uses };
    } else {
        //console.log('response', await response.json());
        return { error: true };
    }
};

export default router