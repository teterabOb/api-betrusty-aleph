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
    WORLD_REDIRECT_URL: string;
}

export interface MLEnv {
    ML_CLIENT_ID: string;
    ML_CLIENT_SECRET: string;
    ML_REDIRECT_URL: string;
}

export interface GitHubEnv {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
}

export const GetWorldIDEnv = () => {
    const worldIDEnvData: WorldIDEnv = {
        WORLD_ID: process.env.WORLD_ID || "",
        WORLD_SECRET: process.env.WORLD_SECRET || "",
        WORLD_REDIRECT_URL: process.env.WORLD_REDIRECT_URL || ""
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
