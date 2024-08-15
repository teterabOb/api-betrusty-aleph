import { sql } from "@vercel/postgres";

// Clase de error personalizada
class CustomError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.name = "CustomError";
    }
}

export interface Tokens {
    idUser: string;
    accessToken: string;
    expires_in: string;
    refresh_token: string;
    refresh_token_expires_in: string;
    email: string;
  }

const saveTokens = async (idUser: string, accessToken: string, expires_in: string, refresh_token: string, refresh_token_expires_in: string, email: string) => {
    console.log("Saving tokens");
    console.log("email from github : " ,email);
    
    if (idUser === undefined || accessToken === undefined || expires_in === undefined || refresh_token === undefined || refresh_token_expires_in === undefined || email === undefined)
        return new CustomError("Missing parameters", 400);

    try {
        const result = await sql`INSERT INTO 
        Github(
        ID_USER, 
        ACCESS_TOKEN, 
        EXPIRES_IN, 
        REFRESH_TOKEN, 
        REFRESH_TOKEN_EXPIRES_IN,
        EMAIL
        )
        VALUES(${idUser}, ${accessToken}, ${expires_in}, ${refresh_token}, ${refresh_token_expires_in}, ${email});`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error saving tokens", 500);
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
        WHERE EMAIL = ${email};`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error updating token", 500);
    }
}

const getUser = async (idUser: string) => {
    try {
        const result = await sql`SELECT * FROM Users WHERE ID_USER = ${idUser};`;
        return result;
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting user", 500);
    }
}

const getGithubByEmail = async (email: string) => {
    try {
        const result = await sql`SELECT * FROM Github WHERE EMAIL = ${email};`;
        return result;
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting user", 500);
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
        console.log(error);
        throw new CustomError("Error saving user", 500);
    }
}


export default { saveTokens, saveUser, getUser, getGithubByEmail, updateToken }; 