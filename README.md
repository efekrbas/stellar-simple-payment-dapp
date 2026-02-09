# Stellar Simple Payment dApp

This project is a simple Stellar dApp built with React and Vite, designed to fulfill the **Stellar White Belt Level 1** requirements.

It allows users to connect their Freighter wallet, view their XLM balance on the Stellar Testnet, and send payments to other accounts.

## Tech Stack

-   **Frontend**: React (Vite)
-   **Blockchain SDK**: `@stellar/stellar-sdk`
-   **Wallet Integration**: `@stellar/freighter-api`
-   **Styling**: Vanilla CSS

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed.
2.  **Freighter Wallet**: Install the [Freighter browser extension](https://www.freighter.app/) and create an account.
3.  **Testnet**: Switch your Freighter network to **"Testnet"**.

## Setup & Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open the App**:
    Visit `http://localhost:5173/` in your browser.

## Features

The application demonstrates the following core dApp functionalities:

### 1. Wallet Connection
-   [x] **Connect Button**: Users can connect their Freighter wallet.
-   [x] **Public Key Display**: The connected wallet's public key is shown (shortened).

### 2. Account Information
-   [x] **Balance Display**: Fetches and displays the native XLM balance from Horizon Testnet.
-   [x] **Friendbot Funding**: If the account doesn't exist on Testnet, a "Fund with Friendbot" button appears to create and fund it.

### 3. Send Payment
-   [x] **Payment Form**: User can input a destination address and XLM amount.
-   [x] **Validation**: Prevents invalid addresses and negative/zero amounts.
-   [x] **Transaction Signing**: seamless integration with Freighter for signing transactions.
-   [x] **Submission**: Submits the transaction to the Stellar Testnet.

### 4. Transaction Feedback
-   [x] **Loading States**: UI updates during transaction processing.
-   [x] **Success/Error Messages**: Clear feedback on transaction status.
-   [x] **Explorer Link**: Provides a direct link to `stellar.expert` to view successful transactions.

## Screenshots

| Wallet Connected | Balance Displayed |
| ---------------- | ----------------- |
| ![Wallet Connected](/public/screenshots/wallet-connected.png) | ![Balance Displayed](/public/screenshots/balance.png) |

### Successful Transaction
![Successful Transaction](/public/screenshots/transaction-success.png)

## Project Structure

```
src/
├── components/           # UI Components
│   ├── WalletConnect/    # Wallet connection logic & UI
│   ├── AccountInfo/      # Balance display & Friendbot
│   └── PaymentForm/      # Transaction form & submission
├── services/             # Stellar & Freighter Logic
│   ├── stellar.js        # Horizon API interactions
│   └── freighter.js      # Wallet API wrappers
├── utils/                # Helper functions
│   └── format.js         # Address formatting & validation
├── App.jsx               # Main application layout
└── main.jsx              # Entry point
```

## License

MIT
