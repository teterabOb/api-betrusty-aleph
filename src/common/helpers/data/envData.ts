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

export  const getEnvData = () => {
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
