import { AuctionData, makeOffer } from '../services/bidder'
import { acceptOffer, getHashedBidderSig } from '../services/owner'
import { mintNFTMarketplace } from '../services/marketplace';
import { getListOfAvailableItems } from "../common/helpers/data/sessionData";

async function mintNFT(_req: any, res: any) {     
    try {        
        const response = await mintNFTMarketplace()        
        res.status(200).json({ response })
    } catch (error: any) {
        res.status(500).json({ error: error.message})
    }
}

async function listOfAvailableItems(_req: any, res: any) {     
    try {        
        const response = await getListOfAvailableItems()        
        res.status(200).json({ response })
    } catch (error: any) {
        res.status(500).json({ error: error.message})
    }
}

async function acceptOfferByOwner(req: any, res: any) { 
    const ownerSig: string = req.body.ownerSig;

    try {
        const response = await acceptOffer(ownerSig)
        res.status(200).json({ response })
    } catch (error: any) {
        res.status(500).json({ error: error.message})
    }
}
async function makeOfferByBidder(req: any, res: any) {
    const auctionData: AuctionData = req.body.auctionData
        
    try {
        const response = await makeOffer(auctionData);
        res.status(200).json({ response })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

function getHashedBidderSignature(_req: any, res: any) {
    const hashedBidderSig = getHashedBidderSig()
    res.status(200).json({ hashedBidderSig })
 }

export  {
    acceptOfferByOwner,
    makeOfferByBidder,
    getHashedBidderSignature,
    mintNFT,
    listOfAvailableItems
}