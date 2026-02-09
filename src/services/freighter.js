import { isConnected, requestAccess, signTransaction as freighterSign } from "@stellar/freighter-api";
import { Networks } from "@stellar/stellar-sdk";

export const checkConnection = async () => {
    const isFreighterConnected = await isConnected();
    if (isFreighterConnected) {
        return true;
    }
    return false;
};

export const retrievePublicKey = async () => {
    let publicKey = "";
    let error = "";
    try {
        const key = await requestAccess();
        if (typeof key === 'string') {
            publicKey = key;
        } else if (key && key.address) {
            publicKey = key.address;
        } else if (key && key.publicKey) {
            publicKey = key.publicKey;
        } else {
            console.warn("Unexpected key format from Freighter:", key);
            publicKey = "";
        }
    } catch (e) {
        // Ensure we return a string, not an object
        error = e.message || e.toString();
    }
    if (error) {
        return { error };
    }
    return { publicKey };
};

export const signTransaction = async (xdr) => {
    const result = await freighterSign(xdr, {
        networkPassphrase: Networks.TESTNET,
    });
    if (result.error) {
        throw new Error(result.error);
    }
    return result.signedTxXdr;
};
