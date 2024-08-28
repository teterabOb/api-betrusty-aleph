import { sql } from "@vercel/postgres";

// Clase de error personalizada
class CustomError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.name = "CustomError";
    }
}
/*
export interface Tokens {
    idUser: string;
    accessToken: string;
    expires_in: string;
    refresh_token: string;
    refresh_token_expires_in: string;
    email: string;
}
*/

const saveTokens = async (id_user: string, did: string, accessToken: string, expires_in: string, refresh_token: string, refresh_token_expires_in: string, email: string) => {
    if (id_user === undefined || accessToken === undefined || expires_in === undefined || refresh_token === undefined || refresh_token_expires_in === undefined || email === undefined)
        return new CustomError("Missing parameters", 400);

    try {
        const result = await sql`INSERT INTO 
        Github( 
        ID_USER,
        DID,
        ACCESS_TOKEN, 
        EXPIRES_IN, 
        REFRESH_TOKEN, 
        REFRESH_TOKEN_EXPIRES_IN,
        EMAIL
        )
        VALUES(${id_user},${did}, ${accessToken}, ${expires_in}, ${refresh_token}, ${refresh_token_expires_in}, ${email});`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error saving tokens", 500);
    }
}

const saveTokensWorldID = async (id_user: string, access_token: string, token_type: string, expires_in: string, scope: string, id_token: string, email: string) => {
    if (id_user === undefined || access_token === undefined || token_type === undefined || expires_in === undefined || scope === undefined || id_token === undefined)
        return new CustomError("Missing parameters", 400);

    try {
        const result = await sql`INSERT INTO 
        WorldID( 
        ID_USER,
        ACCESS_TOKEN, 
        TOKEN_TYPE, 
        EXPIRES_IN, 
        SCOPE, 
        ID_TOKEN,
        EMAIL
        )
        VALUES(${id_user}, ${access_token}, ${token_type}, ${expires_in}, ${scope}, ${id_token}, ${email});`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error saving tokens", 500);
    }
}

const updateTokenGithub = async (id_user: string,
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

const updateTokenWorldID = async (id_user: string, access_token: string, token_type: string, expires_in: string, scope: string, id_token: string) => {
    try {
        const result = await sql`UPDATE WorldID 
        SET ACCESS_TOKEN = ${access_token}, 
        TOKEN_TYPE = ${token_type}, 
        EXPIRES_IN = ${expires_in}, 
        SCOPE = ${scope}, 
        ID_TOKEN = ${id_token}
        WHERE ID_USER = ${Number(id_user)};`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error updating token World ID", 500);
    }
}

const updateUserML = async (id_user: string, data: string) => {
    try {
        const jsonData = JSON.stringify(data);
        const result = await sql`UPDATE MercadoLibre 
        SET DATA = ${jsonData}
        WHERE ID_USER = ${id_user};`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error updating user updateUserML", 500);
    }
}

const getUserMLByEmail = async (id_user: string) => {
    try {
        const result = await sql`SELECT * FROM MercadoLibre WHERE id_user = ${id_user};`;
        return result;
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting MercadoLibre", 500);
    }
}

const getUser = async (email: string) => {
    try {
        const result = await sql`SELECT * FROM Users WHERE EMAIL = ${email};`;
        return result;
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting user", 500);
    }
}

const getGithubByUserId = async (id_user: string) => {
    try {
        const result = await sql`SELECT * FROM Github WHERE ID_USER = ${id_user};`;
        return result;
    } catch (error) {
        //console.log(error);
        throw new CustomError("Error getting user", 500);
    }
}

const getGithubByEmail = async (email: string) => {
    try {
        const result = await sql`SELECT * FROM Github WHERE  = ${email};`;
        return result;
    } catch (error) {
        //console.log(error);
        throw new CustomError("Error getting user", 500);
    }
}

const getUserByEmail = async (email: string) => {
    try {
        const result = await sql`SELECT id_user FROM Users WHERE EMAIL = ${email};`;
        return result;
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting user", 500);
    }
}

const getAllDataUserByEmail = async (email: string) => {
    try {
        const result = await sql`SELECT * FROM Users WHERE EMAIL = ${email};`;
        return result;
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting user", 500);
    }
}

const saveUser = async (did: string, name: string = "anon", email: string) => {
    try {
        const result = await sql`INSERT INTO 
        Users( 
        DID, 
        NAME, 
        EMAIL)
        VALUES(${did}, ${name}, ${email});`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error saving user: saveUser", 500);
    }
}

const saveUserML = async (id_user: string, did: string, data: string, email: string) => {     
    try {
        const jsonData = JSON.stringify(data);
        const result = await sql`INSERT INTO 
        MercadoLibre( 
        ID_USER, 
        DID, 
        DATA, 
        EMAIL)
        VALUES(${id_user}, ${did}, ${jsonData}, ${email});`;
        return result
    } catch (error) {
        console.log(error);
        throw new CustomError("Error saving user : saveUserML", 500);
    }
}

export default
    {
        saveTokens,
        saveTokensWorldID,
        saveUser,
        getUser,
        getGithubByEmail,
        updateTokenGithub,
        updateTokenWorldID,
        getUserByEmail,
        getGithubByUserId,
        getUserMLByEmail,
        saveUserML,
        getAllDataUserByEmail,
        updateUserML
    }; 