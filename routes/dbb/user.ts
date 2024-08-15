import { sql } from "@vercel/postgres";

const saveTokens = async (idUser: string, accessToken: string, expires_in: string, refresh_token: string, refresh_token_expires_in: string) => {
    try {
        const result = await sql`INSERT INTO 
        Github(ID_USER , 
        ACCESS_TOKEN, 
        EXPIRES_IN, 
        REFRESH_TOKEN, 
        REFRESH_TOKEN_EXPIRES_IN)
        VALUES(${idUser}, ${accessToken}, ${expires_in}, ${refresh_token}, ${refresh_token_expires_in})`;
        return result
    } catch (error) {
        return error;
    }
}

const saverUser = async (idUser: string, accessToken: string, expires_in: string, refresh_token: string, refresh_token_expires_in: string) => {
    try {
        const result = await sql`INSERT INTO 
        User(ID_USER, 
        ACCESS_TOKEN, 
        EXPIRES_IN, 
        REFRESH_TOKEN, 
        REFRESH_TOKEN_EXPIRES_IN)
        VALUES(${idUser}, ${accessToken}, ${expires_in}, ${refresh_token}, ${refresh_token_expires_in})`;
        return result
    } catch (error) {
        return error;
    }
}


export default {saveTokens, saverUser}; 