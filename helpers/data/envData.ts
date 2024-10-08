import dotenv from 'dotenv'
dotenv.config()

export interface EnvironmentData {
    ownerPrivateKey: string;
    bidderPrivateKey: string;
    rpcEndpoint: string;
    ERC20CcontractAddress: string;
    ERC721ContractAddres: string;
    MarketplaceContractAddress: string;
}

export interface WorldIDEnv {
    WORLD_ID: string;
    WORLD_SECRET: string;
    WORLD_REDIRECT_URI: string;
    WORLDID_TOKEN_URL: string;
    WORLDID_BASIC_TOKEN: string;
}

export interface MLEnv {
    ML_CLIENT_ID_CL: string;
    ML_CLIENT_SECRET_CL: string;
    ML_REDIRECT_URI_CL: string;
    ML_CLIENT_ID_AR: string;
    ML_CLIENT_SECRET_AR: string;
    ML_REDIRECT_URI_AR: string;
}

export interface GitHubEnv {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
}

export interface WebEnv { 
    WEB_URL: string;
}

export const GetWorldIDEnv = () => {
    const worldIDEnvData: WorldIDEnv = {
        WORLD_ID: process.env.WORLDID_APP_ID || "",
        WORLD_SECRET: process.env.WORLDID_ACTION_ID || "",
        WORLD_REDIRECT_URI: process.env.WORLDID_REDIRECT_URI || "",
        WORLDID_TOKEN_URL: process.env.WORLDID_TOKEN_URL || "",
        WORLDID_BASIC_TOKEN: process.env.WORLDID_BASIC_TOKEN || ""
    }
    return worldIDEnvData;
}

export const GetGitHubEnv = () => {
    const githubEnvData: GitHubEnv = {
        CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
        CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
        REDIRECT_URI: process.env.GITHUB_REDIRECT_URI || ""
    }
    return githubEnvData;
}

export const GetMLEnv = () => { 
    const mlEnvData: MLEnv = {
        ML_CLIENT_ID_CL: process.env.ML_CLIENT_ID_CL || "",
        ML_CLIENT_SECRET_CL: process.env.ML_CLIENT_SECRET_CL || "",
        ML_REDIRECT_URI_CL: process.env.ML_REDIRECT_URI_CL || "",
        ML_CLIENT_ID_AR: process.env.ML_CLIENT_ID_AR || "",
        ML_CLIENT_SECRET_AR: process.env.ML_CLIENT_SECRET_AR || "",
        ML_REDIRECT_URI_AR: process.env.ML_REDIRECT_URI_AR || ""
    }
    return mlEnvData;
}

export const getEnvData = () => {
    const envData: EnvironmentData = {
        ownerPrivateKey: process.env.OWNER_PRIVATE_KEY || "",
        bidderPrivateKey: process.env.BIDDER_PRIVATE_KEY || "",
        rpcEndpoint: process.env.RPC_ENDPOINT || "",
        ERC20CcontractAddress: process.env.ERC20_CONTRACT_ADDRESS || "",
        ERC721ContractAddres: process.env.ERC721_CONTRACT_ADDRESS || "",
        MarketplaceContractAddress: process.env.MARKETPLACE_CONTRACT_ADDRESS || ""
    }
    return envData
}

export const GetWebEnv = () => { 
    const webEnvData: WebEnv = {
        WEB_URL: process.env.WEB_URL || ""
    }
    return webEnvData;
}
