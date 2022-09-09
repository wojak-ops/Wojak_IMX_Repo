# Instructions 

This script is a work in progress use at your own will. Currently it is designed to bulk list NFTs from a collection for sale at the same price. 

1. Run the following commands to install the packages and initialise the project. 
npm install --dev 
npm install -g typescript 
npm install -g ts-node 

2. Open index.ts 

3. Update privateKey to your privateKey

3. Modify the parameters in lines 104-114 

`sellPrice` = price you want to sell NFT for 
`token_address `= collection address. This can be obtained from clicking on your NFT and looking at the url 
`token_id` = the token id to start your loop at. This will be 1 if this is the first time you are listing
`end` = the token id to stop your loop at. Set this to 1 if you only wish to make one order.
 
4. Run ts-node index.ts 


   