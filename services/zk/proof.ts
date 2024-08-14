import { BeTrustyCircom } from "../../interfaces/BeTrustyCircom"
import snarkjs from "snarkjs"
import path from "path"


export async function generateProof(inputs: BeTrustyCircom) {
    const wasmPath = path.join(__dirname, '..', 'public', 'zk', 'betrusty.wasm');
    const zkeyPath = path.join(__dirname, '..', 'public', 'zk', 'multiplier_0001.zkey');
    // Podriamos ocuparlo para validar en el back-end la firma
    //const vkeyPath = path.join(__dirname, '..', 'public', 'zk', 'verification_key.json');

    //document.getElementById("web3_message").textContent = "Generating proof...";
    const { proof, publicSignals } = 
    await snarkjs.groth16.fullProve({
        linkedinProfession: inputs.linkedinProfession,
        platformScore: inputs.platformScore,
        residenceCountry: inputs.residenceCountry,
        creditScore: inputs.creditScore,
        walletBalance: inputs.walletBalance,
        userId: inputs.userId,
        nonce: inputs.nonce,
        clientRequeriments: inputs.clientRequeriments
    }, wasmPath, zkeyPath);



    const pA = proof.pi_a
    pA.pop()
    const pB = proof.pi_b
    pB.pop()
    const pC = proof.pi_c
    pC.pop()

    /*
    const result = await my_contract.methods.sendProof(pA, pB, pC, publicSignals)
        .send({ from: accounts[0], gas: 0, value: 0 })
        .on('transactionHash', function (hash) {
            document.getElementById("web3_message").textContent = "Executing...";
        })
        .on('receipt', function (receipt) {
            document.getElementById("web3_message").textContent = "Success.";
        })
        .catch((revertReason) => {
            console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
        });
    */

    return inputs;
}