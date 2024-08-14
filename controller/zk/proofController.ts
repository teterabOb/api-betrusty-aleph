import { generateProof } from "../../services/zk/proof"
import { Request, Response } from "express"
import { BeTrustyCircom } from "../../interfaces/BeTrustyCircom";

async function GenerateProof(_req: Request, res: Response) {

    try {
        const {
            linkedinProfession,
            platformScore,
            residenceCountry,
            creditScore,
            walletBalance,
            userId,
            nonce,
            clientRequeriments
        } = _req.body;
        let beTrustyCircom: BeTrustyCircom = {
            linkedinProfession,
            platformScore,
            residenceCountry,
            creditScore,
            walletBalance,
            userId,
            nonce,
            clientRequeriments
        }
        const proof = await generateProof(beTrustyCircom);
        return res.status(200).json({ success: true, data: proof });
    } catch (error) {
        return res.status(500).json({ success: false, data: error });
    }
}

export {
    GenerateProof
}