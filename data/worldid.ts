import { sql } from "@vercel/postgres";

class CustomError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.name = "CustomError";
    }
}

export interface Users {
    
}