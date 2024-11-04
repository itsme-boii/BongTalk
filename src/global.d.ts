// globals.d.ts
interface Window {
  solana: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      // Add any other methods and properties you need from the solana object
  };
}
