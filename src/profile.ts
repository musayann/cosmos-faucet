import { pathToString } from "@cosmjs/crypto";
import { makeCosmoshubPath, Secp256k1HdWallet, SigningCosmosClient } from "@cosmjs/launchpad";
import { DirectSecp256k1HdWallet, isOfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

import * as constants from "./constants";

export async function createWallets(
  mnemonic: string,
  addressPrefix: string,
  numberOfDistributors: number,
  stargate = true,
  logging = false,
): Promise<ReadonlyArray<readonly [string, OfflineSigner]>> {
  const createWallet = stargate ? DirectSecp256k1HdWallet.fromMnemonic : Secp256k1HdWallet.fromMnemonic;
  const wallets = new Array<readonly [string, OfflineSigner]>();

  // first account is the token holder
  const numberOfIdentities = 1 + numberOfDistributors;
  for (let i = 0; i < numberOfIdentities; i++) {
    const path = makeCosmoshubPath(i);
    const wallet = await createWallet(mnemonic, path, addressPrefix);
    const [{ address }] = await wallet.getAccounts();
    if (logging) {
      const role = i === 0 ? "token holder " : `distributor ${i}`;
      console.info(`Created ${role} (${pathToString(path)}): ${address}`);
    }
    wallets.push([address, wallet]);
  }

  return wallets;
}

export async function createClients(
  apiUrl: string,
  wallets: ReadonlyArray<readonly [string, OfflineSigner]>,
): Promise<ReadonlyArray<readonly [string, SigningCosmosClient | SigningStargateClient]>> {
  // we need one client per sender
  return Promise.all(
    wallets.map(
      async ([senderAddress, wallet]): Promise<
        readonly [string, SigningCosmosClient | SigningStargateClient]
      > => [
        senderAddress,
        isOfflineDirectSigner(wallet)
          ? await SigningStargateClient.connectWithSigner(apiUrl, wallet, {
              gasLimits: constants.gasLimits,
              gasPrice: constants.gasPrice,
            })
          : new SigningCosmosClient(apiUrl, senderAddress, wallet, constants.gasPrice, constants.gasLimits),
      ],
    ),
  );
}
