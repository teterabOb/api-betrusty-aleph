import express from 'express'
import transactionRouter from './routes/transactions'
import { getAbiMockERC20, getAbiMockERC721, getAbiMarketplace } from './services/transactionService'
import { Network, Alchemy } from 'alchemy-sdk';
import {ethers} from 'ethers'
import * as bodyParser from "body-parser"
import { AuctionData, makeOffer } from './services/bidder';
import { acceptOffer, getHashedBidderSig } from './services/owner';

const app = express()
app.use(express.json())

const PORT = 3000

app.get('/ping', async(_req, res) => {
    const erc20TokenAddress = "0xbd65c58D6F46d5c682Bf2f36306D461e3561C747" 
    const erc721TokenAddress = "0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff"
    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/dBkH4MXYbovXOQio8relKoPcE29g-AFu")
    const PRIVATE_KEY = "af45e952ed8f4c1b879fa5fd999750969e5e7e4f5327af389f4d2fa3d012b1ce"
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const contractERC20 = new ethers.Contract(erc20TokenAddress, getAbiMockERC20(), signer)
    const contractERC721 = new ethers.Contract(erc721TokenAddress, getAbiMockERC721(), signer)

    const result = await contractERC20.decimals()
    const tx = await contractERC721.mint(signer.address)
    await tx.wait()

    console.log("transaction");
    
    console.log(tx)    

    const settings = {
        apiKey: "dBkH4MXYbovXOQio8relKoPcE29g-AFu",
        network: Network.ETH_SEPOLIA
    }

    const alchemy = new Alchemy(settings)
    const latestBlock = await alchemy.core.getBlockNumber();

    console.log(latestBlock)
    console.log(result.toString())
    res.send('provider')
})

app.get('/mint', async(_req, res) => {    
    const erc721TokenAddress = "0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff"
    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/dBkH4MXYbovXOQio8relKoPcE29g-AFu")
    const PRIVATE_KEY = "af45e952ed8f4c1b879fa5fd999750969e5e7e4f5327af389f4d2fa3d012b1ce"
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)    
    const contractERC721 = new ethers.Contract(erc721TokenAddress, getAbiMockERC721(), signer)
    
    const tx = await contractERC721.mint(signer.address)
    await tx.wait()

    console.log("transaction");
    
    console.log(tx)
            
    res.send('nft minted')
})

app.get('/sign', async(_req, res) => { 

    let auctionData = {
        collectionAddress : "0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff",
        erc20Address : "0xbd65c58D6F46d5c682Bf2f36306D461e3561C747",
        tokenId : 62,
        bid : "1"
    }

    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/dBkH4MXYbovXOQio8relKoPcE29g-AFu")
    const PRIVATE_KEY = "af45e952ed8f4c1b879fa5fd999750969e5e7e4f5327af389f4d2fa3d012b1ce"
    const BIDDER_PRIVATE_KEY = "93fdace02cf2e5f687a857cd563fad5f0ceafbba571e4d2767eb955a947bb440"

    const seller = new ethers.Wallet(PRIVATE_KEY, provider)   
    const buyer = new ethers.Wallet(BIDDER_PRIVATE_KEY, provider) 

    console.log("seller address :" , seller.address);
    console.log("buyer address :" , buyer.address);
        
    //const erc721TokenAddress = "0xFCE9b92eC11680898c7FE57C4dDCea83AeabA3ff"
    const marketplaceAddress = "0x597C9bC3F00a4Df00F85E9334628f6cDf03A1184"

    const marketplace = new ethers.Contract(marketplaceAddress, getAbiMarketplace(), seller)
    console.log("marketplace" , marketplace.target);
            

    const messageHash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [
          auctionData.collectionAddress,
          auctionData.erc20Address,
          auctionData.tokenId,
          auctionData.bid,
        ]
      );

    // Firma el messageHash con la clave privada del postor (bidder)
    const bidderSig = await buyer.signMessage(ethers.utils.arrayify(messageHash));

    // Hashea la firma del postor para obtener hashedBidderSig
    const hashedBidderSig = ethers.utils.keccak256(
        ethers.utils.arrayify(bidderSig)
    );

    // Firma hashedBidderSig con la clave privada del propietario (owner)
    const ownerSig = await seller.signMessage(ethers.utils.arrayify(hashedBidderSig));

    console.log("Bidder Signature:", bidderSig);
    console.log("Owner Signature:", ownerSig);
   
    const finishAuction = await marketplace.finishAuction(auctionData, bidderSig, ownerSig)
    finishAuction.wait()
                
    //const setApprovalForAll = await contractERC721.setApprovalForAll(marketplaceAddress, true)    
    //setApprovalForAll.wait();
    //const ownerApprovedSig = "0xb2692b96a06bc3c6f6a0cb2e60a9381e44a463b44fc013b11395c064d09ef7245fd00e831e05c94252fbcc368eb8032649631abe28300f19c49cacd8d43062d71c"
    
    console.log("signature");                
    res.send('message signed')
})

app.post("/make-offer", async(req, res) => {
    const auctionData: AuctionData = req.body

    try {
        const bidderSig = await makeOffer(auctionData);
        res.status(200).json({ bidderSig })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

app.post("/accept-offer", async(req, res) => {
    const ownerSig: string = req.body.ownerSig;

    try {
        const result = await acceptOffer(ownerSig)
        res.status(200).json({ result })
    } catch (error: any) {
        res.status(500).json({ error: error.message})
    }
})

app.get("/hashed-bidder-sig", (_req, res) => {
    const hashedBidderSig = getHashedBidderSig()
    res.status(200).json({ hashedBidderSig })
})

app.use('/api/transactions', transactionRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`)
})