import { sql } from "@vercel/postgres";

const saveTokens = async (idUser: string, accessToken: string, expires_in: string, refresh_token: string, refresh_token_expires_in: string, email: string) => {

    if (idUser === undefined || accessToken === undefined || expires_in === undefined || refresh_token === undefined || refresh_token_expires_in === undefined)
        throw new Error("Undefined values");

    try {
        const result = await sql`INSERT INTO 
        Github(
        ID_USER, 
        ACCESS_TOKEN, 
        EXPIRES_IN, 
        REFRESH_TOKEN, 
        REFRESH_TOKEN_EXPIRES_IN,
        EMAIL)
        VALUES(${idUser}, ${accessToken}, ${expires_in}, ${refresh_token}, ${refresh_token_expires_in});`;
        return result
    } catch (error) {
        return error;
    }
}

const updateToken = async (idUser: string,
    accessToken: string, expires_in: string,
    refresh_token: string,
    refresh_token_expires_in: string,
    email: string) => {
    try {
        const result = await sql`UPDATE Github 
        SET ACCESS_TOKEN = ${accessToken}, 
        EXPIRES_IN = ${expires_in}, 
        REFRESH_TOKEN = ${refresh_token}, 
        REFRESH_TOKEN_EXPIRES_IN = ${refresh_token_expires_in}
        WHERE ID_USER = ${idUser};`;
        return result
    } catch (error) {
        return error;
    }
}

const getUser = async (idUser: string) => { 
    try {
        const result = await sql`SELECT * FROM Users WHERE ID_USER = ${idUser};`;
        return result;
    } catch (error) {
        return error;
    }
}

const getGithubByEmail = async (email: string) => { 
    try {
        const result = await sql`SELECT * FROM Github WHERE EMAIL = ${email};`;
        return result;
    } catch (error) {
        return error;
    }
}

const saveUser = async (idUser: string, accessToken: string, expires_in: string, refresh_token: string, refresh_token_expires_in: string) => {
    try {
        const result = await sql`INSERT INTO 
        User(ID_USER, 
        ACCESS_TOKEN, 
        EXPIRES_IN, 
        REFRESH_TOKEN, 
        REFRESH_TOKEN_EXPIRES_IN)
        VALUES(${idUser}, ${accessToken}, ${expires_in}, ${refresh_token}, ${refresh_token_expires_in});`;
        return result
    } catch (error) {
        return error;
    }
}


export default { saveTokens, saveUser, getUser, getGithubByEmail, updateToken }; 