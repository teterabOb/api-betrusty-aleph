import express from 'express'
import { mintNFT, makeOfferByBidder }  from '../controller/transactionController'
import { acceptOffer } from '../services/owner'
import { getListOfAvailableItems, getListOfSignatures } from "../common/helpers/data/sessionData"

const router = express.Router()

router.get('/', (_req, res) => {
    res.send('Welcome to the API!')
})  

router.get('/list-of-items', (_req, _res) => {
    getListOfAvailableItems()
})  

router.get('/list-of-signed', (_req, _res) => {
    getListOfSignatures()
})  

router.post('/mint-nft', async(req, res) => {
    await mintNFT(req, res)        
})


router.post('/accept-offer', async(req, res) => {
    await acceptOffer(req)
})  

router.post('/make-offer', async(req, res) => {
    await makeOfferByBidder(req, res)
})  

router.get('/hashed-bidder-sig', (_req, res) => {
    console.log("hola")
    res.send('Sending tx! hola')
})  

export default router