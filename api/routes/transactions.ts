import express from "express";
import {
  mintNFT,
  makeOfferByBidder,  
  listOfSignatures,
  acceptOfferByOwner,
  mintERC20
} from "../controller/transactionController";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Welcome to the Cheap Marketplace API!");
});

router.get("/list-of-signed", async (req, res) => {
  listOfSignatures(req, res);
});

router.post("/mint-nft", async (req, res) => {
  await mintNFT(req, res);
});

router.post("/mint-erc20", async (req, res) => {
  await mintERC20(req, res);
});

router.post("/accept-offer", async (req, res) => {
  await acceptOfferByOwner(req, res);
});

router.post("/make-offer", async (req, res) => {
  await makeOfferByBidder(req, res);
});

export default router;
