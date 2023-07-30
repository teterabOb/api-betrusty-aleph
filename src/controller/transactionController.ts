import { AuctionData, makeOffer } from "../services/bidder";
import { acceptOffer } from "../services/owner";
import {
  GetListOfSignatures,
  mintNFTMarketplace,
  mintTokensERC20
} from "../services/marketplace";


async function mintNFT(_req: any, res: any) {
  try {
    const response = await mintNFTMarketplace();
    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function mintERC20(req: any, res: any) {        
    const {address, amount} = req.body
    console.log(address, amount);
    
    try {
      const response = await mintTokensERC20(address, amount);
      res.status(200).json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

async function listOfSignatures(_req: any, res: any) {
  try {
    const response = GetListOfSignatures();
    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function acceptOfferByOwner(req: any, res: any) {
  const auctionData: AuctionData = req.body.auctionData;

  try {
    const response = await acceptOffer(auctionData);
    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
async function makeOfferByBidder(req: any, res: any) {
  const auctionData: AuctionData = req.body.auctionData;

  try {
    const response = await makeOffer(auctionData);
    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

/*
function getHashedBidderSignature(_req: any, res: any) {
  const hashedBidderSig = getHashedBidderSig();
  res.status(200).json({ hashedBidderSig });
}
*/

export {
  acceptOfferByOwner,
  makeOfferByBidder,
  mintNFT,  
  mintERC20,
  listOfSignatures,
};
