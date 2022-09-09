// User registration offchain using direct injection of private key
import { ethers } from 'ethers';
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { BaseSigner, WalletConnection, getConfig, Workflows, generateStarkWallet } from '@imtbl/core-sdk';

const ethNetwork = 'ropsten';

const generateWalletConnection = async () : Promise<WalletConnection> => {
 
    // Sets up the provider
     const alchemyApiKey = 'DvukuyBzEK-JyP6zp1NVeNVYLJCrzjp_';
     const alchemyProvider = new AlchemyProvider(ethNetwork, alchemyApiKey);
 

     // Good practise to comment your public key so you know which wallet this is for 
     const privateKey = 'replace this with your own private key';
     const l1Wallet = new Wallet(privateKey);
 
     // Sets up the L1Signer
     const l1Signer = l1Wallet.connect(alchemyProvider);
  
    // L2 credentials
    const starkWallet = await generateStarkWallet(l1Signer);
    const l2Signer = new BaseSigner(starkWallet.starkKeyPair);
  
    return {
      l1Signer,
      l2Signer,
    };
  };




const createOrder = async (sellPrice: string, tokenAddress: string, tokenID: string) => {


    // Sets up the Core SDK workflows
    const coreSdkConfig = getConfig(ethNetwork);
    const coreSdkWorkflows = new Workflows(coreSdkConfig);

    // Order expiration in UNIX timestamp
    // In this case, set the expiration date as 1 month from now
    const now = new Date(Date.now());
    now.setMonth(now.getMonth() + 1);
    const timestamp = Math.floor(now.getTime() / 1000);
    
    const  WC = await generateWalletConnection();

    // Object with key-value pairs that implement the GetSignableOrderRequest interface
    const orderParameters = {
    
        // Change '0.1' to any value of the currency wanted to sell this asset
        amount_buy: ethers.utils.parseEther(sellPrice).toString(),
        
        // Change '1' to any value indicating the number of assets you are selling
        amount_sell: '1',
        
        expiration_timestamp: timestamp,
        
        // Fees are optional; for simplicity, no maker or taker fees are added in this sample
        fees: [],
        
        // The currency wanted to sell this asset
        token_buy: {
        
            type: 'ETH', // Or 'ERC20' if it's another currency    
            data: {
                //token_address: '', // Or the token address of the ERC20 token
                decimals: 18, // Or any decimals used by the token
            },
        },
        
        // The asset being sold
        token_sell: {
        
            type: 'ERC721',
            data: {
                // The collection address of this asset
                token_address: tokenAddress,
                
                // The ID of this asset
                token_id: tokenID,
            },
        },
        // The ETH address of the L1 Wallet
        user: await WC.l1Signer.getAddress(),
    };

    
    // Call the createOrderWithSigner method exposed by the Workflow class
    const response = await coreSdkWorkflows.createOrderWithSigner(
        WC, orderParameters
    );
    // This will log the response specified in this API: https://docs.x.immutable.com/reference/#/operations/createOrder
    console.log(response);
};



async function main()  {

// These are the inputs for bulk minting

    // Selling price of each NFT
    const sellPrice = '1';
    // Collection token address
    const token_address = '0x3430772065ac793ce403212f37b7f6b217aab924';
    // Inital token START
    var token_id = '1';
    //Specify how many loops should run 
    var end = 0;


    var id = Number(token_id);

    for(id; id<=end; id++) {
        await createOrder(sellPrice, token_address, id.toString());
    }


}   

main()
.then(() => console.log('createOrderWithSigner call complete'))
.catch(err => {
console.error(err);
process.exit(1);
});