
import { Horizon, TransactionBuilder, Networks, Asset, Operation } from '@stellar/stellar-sdk';

const TESTNET_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(TESTNET_URL);

/**
 * Fetches account details from Horizon
 * @param {string} publicKey 
 * @returns {Promise<object>} Account object or null if not found
 */
export const getAccountDetails = async (publicKey) => {
    try {
        const account = await server.loadAccount(publicKey);
        return account;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Account doesn't exist
        }
        throw error;
    }
};

/**
 * Extracts native XLM balance from account object
 * @param {object} account 
 * @returns {string} Balance string
 */
export const getXLMBalance = (account) => {
    if (!account) return '0';
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
    return xlmBalance ? xlmBalance.balance : '0';
};

/**
 * Funds an account using Friendbot (Testnet only)
 * @param {string} publicKey 
 * @returns {Promise<boolean>} Success status
 */
export const fundAccount = async (publicKey) => {
    try {
        const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
        return response.ok;
    } catch (error) {
        console.error("Friendbot error:", error);
        return false;
    }
};

/**
 * Builds a payment transaction
 * @param {string} sourcePublicKey 
 * @param {string} destinationAddress 
 * @param {string} amount 
 * @returns {Promise<string>} Unsigned Transaction XDR
 */
export const buildPaymentTransaction = async (sourcePublicKey, destinationAddress, amount) => {
    const sourceAccount = await server.loadAccount(sourcePublicKey);

    const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100', // standard fee
        networkPassphrase: Networks.TESTNET,
    })
        .addOperation(Operation.payment({
            destination: destinationAddress,
            asset: Asset.native(),
            amount: amount,
        }))
        .setTimeout(30)
        .build();

    return transaction.toXDR();
};

/**
 * Submits a signed transaction to the Stellar network
 * @param {string} signedXdr 
 * @returns {Promise<object>} Submission result
 */
export const submitTransaction = async (signedXdr) => {
    const transaction = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
    const result = await server.submitTransaction(transaction);
    return result;
};
