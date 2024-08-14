import express from "express"
import {GenerateProof} from "../../controller/zk/proofController"

const router = express.Router();

router.post("/generate-proof", async(_req, res) => {
    await GenerateProof(_req, res)
})

router.get("/", async(_req, res) => {
    
})