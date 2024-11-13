import { AnchorProvider, setProvider, Program, Idl } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";

import idl from "./idl.json";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

const BuyToken = () => {
    const wallet = useAnchorWallet();
    console.log("Wallet is ", wallet);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const programId = new PublicKey("ESxkgjA2FoZ3WrAt3aEewaaZ9nzZsaJfWe3DxffbED2Q");


    const buyToken = async (solAmount: number) => {
        if (wallet) {
            const provider = new AnchorProvider(connection, wallet, {
                preflightCommitment: "confirmed",
            });

            anchor.setProvider(provider);

            const program = new Program(idl as Idl, programId, provider);

            if (!program) {
                console.error("program is undefined");
                return;
            }
            const token = localStorage.getItem("tokenAddress");
            console.log("token from buy token is ", token);

            if (token) {
                console.log("inside buy");
                const tokenPublickey = new PublicKey(token);

                const userTokenAccount = await spl.getAssociatedTokenAddress(
                    tokenPublickey,    // mint
                    wallet.publicKey   // owner
                );

                const sourceTokenAccount = await spl.getAssociatedTokenAddress(
                    tokenPublickey,    // mint
                    wallet.publicKey,         // owner
                    true              // allowOwnerOffCurve
                );
                console.log("token public key is ", tokenPublickey.toString());
                console.log("wallet public key is ", wallet.publicKey.toString());
                const solAmountLamports = new anchor.BN(solAmount * 1e9);
                const associatedTokenAddress = await spl.getAssociatedTokenAddress(
                    tokenPublickey,
                    wallet.publicKey
                );

                const createAtaIx = spl.createAssociatedTokenAccountInstruction(
                    wallet.publicKey, // payer
                    associatedTokenAddress, // ata
                    wallet.publicKey, // owner
                    tokenPublickey // mint
                );
                const [platformStateAccount] = await PublicKey.findProgramAddressSync(
                    [Buffer.from("platform")],
                    programId
                );
                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('processed');
                let transaction = new Transaction({
                    feePayer: wallet.publicKey,
                    recentBlockhash: blockhash
                });

                try {
                    const buyTokensIx = await program.methods
                        .buyTokens(solAmountLamports)
                        .accounts({
                            platform: platformStateAccount,
                            signer: wallet.publicKey,
                            mint: tokenPublickey,
                            tokenInfo: new PublicKey(token),
                            sourceTokenAccount: sourceTokenAccount,
                            userTokenAccount: userTokenAccount,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            tokenProgram: spl.TOKEN_PROGRAM_ID,
                        })
                        .instruction();

                    // Create and send transaction
                    const transactionn = transaction.add(createAtaIx, buyTokensIx);
                    console.log("Transaction Instructions:", transactionn.instructions);
                    const signature = await wallet.signTransaction(transactionn);


                    console.log("Transaction successful:", signature);



                } catch (error) {
                    console.error("Error buying tokens:", error);
                }
            }
        }
    };
    return (
        <div>
            <button onClick={() => buyToken(1)}>Buy Token</button>
        </div>
    )

};

export default BuyToken;
