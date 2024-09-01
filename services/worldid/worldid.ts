import axios from 'axios';
import qs from 'qs';
import userDBB from "../../data/user";
import { GetWorldIDEnv, GetWebEnv } from "../../helpers/data/envData";
import { ISuccessResult } from '@worldcoin/idkit';

const { WEB_URL } = GetWebEnv();
const { WORLD_ID, WORLD_SECRET, WORLD_REDIRECT_URI, WORLDID_TOKEN_URL, WORLDID_BASIC_TOKEN } = GetWorldIDEnv();

export async function GetUserInfo(access_token: string, token_type: string){
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
        userEmail = requestGetUserInfo.data.email;
    } catch (error) {
        console.log("getUserInfo", error);
        throw new Error("Error fetching user data from WorldID");
    } finally {
        return userEmail;
    }
}

export async function getAuthUrl(): Promise<string> {
    const response_type = "code";
    const redirect_uri = WORLD_REDIRECT_URI;
    const scope = "openid+profile+email";
    const client_id = WORLD_ID;
    const world_id_endpoint = "https://worldcoin.org/oauth/authorize";

    return `${world_id_endpoint}?response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}&client_id=${client_id}`;
}

export async function handleCallback(code: string, state: string): Promise<{ idUser: string, userEmail: string }> {
    const endpoint = "https://id.worldcoin.org/token";
    const grant_type = "authorization_code";
    const redirect_uri = WORLD_REDIRECT_URI;

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
    );

    const { access_token, token_type, expires_in, scope, id_token } = response.data;

    let userEmail: string = await getUserInfo(access_token, token_type);

    if (userEmail === "") {
        throw new Error("Error fetching user data from WorldID, empty Email");
    }

    const user = await userDBB.getUserByEmail(userEmail);

    let idUser: string = "";

    if (user.rowCount === 0) {
        await userDBB.saveUser("did1", "anon", userEmail);
        const newUser = await userDBB.getUserByEmail(userEmail);

        if (newUser.rowCount === 0) {
            throw new Error("Error saving user in DB");
        }

        idUser = newUser.rows[0].id_user;
        await userDBB.saveTokensWorldID(idUser.toString(), access_token, token_type, expires_in, scope, id_token, userEmail);
    } else {
        idUser = user.rows[0].id_user;
        await userDBB.updateTokenWorldID(idUser.toString(), access_token, token_type, expires_in, scope, id_token);
    }

    return { idUser, userEmail };
}

export async function getUserInfo(access_token: string, token_type: string): Promise<string> {
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
        );

        userEmail = requestGetUserInfo.data.email;
    } catch (error) {
        console.log("getUserInfo", error);
        throw new Error("Error fetching user data from WorldID");
    } finally {
        return userEmail;
    }
}

export async function verifyProofBackEnd(proof: ISuccessResult, appId: string, action: string) {
    const apiUrl = `https://developer.worldcoin.org/api/v2/verify/${appId}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            verification_level: "orb",
            proof: proof.proof,
            merkle_root: proof.merkle_root,
            nullifier_hash: proof.nullifier_hash,
            credential_type: "orb",
            action: action
        }),
    });

    if (response.ok) {
        const respVerification = await response.json();
        return { error: false, nullifier_hash: respVerification.nullifier_hash, uses: respVerification.uses };
    } else {
        return { error: true };
    }
}