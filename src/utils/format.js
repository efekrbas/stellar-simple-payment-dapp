
import { StrKey } from '@stellar/stellar-sdk';

export const shortenAddress = (address) => {
    if (!address || typeof address !== 'string') return "";
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export const isValidAddress = (address) => {
    return StrKey.isValidEd25519PublicKey(address);
}
