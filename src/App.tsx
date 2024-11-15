import { useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "./App.css";
 
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

import { Buffer } from 'buffer';
import TokenCreator from "./anchor/setup";
import BuyToken from "./anchor/buyToken";
window.Buffer = Buffer;
 
function App() {
 
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
    
    ],
    [network],
  );
 
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <h1>Hello Solana</h1>
          <TokenCreator/>
          <BuyToken/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
 
export default App;