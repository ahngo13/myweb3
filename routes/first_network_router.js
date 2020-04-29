const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
 
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
 
const ccpPath = path.resolve(__dirname, '..' , 'first_articles', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
 
// Create a new CA client for interacting with the CA.
const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
const caTLSCACerts = caInfo.tlsCACerts.pem;
const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
 
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet2');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);


/* GET */
router.get('/query', async (req, res, next) => {
    try{
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet2');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('send_money');

    // Evaluate the specified transaction.   
    const a_result = await contract.evaluateTransaction('query','a');
    const b_result = await contract.evaluateTransaction('query','b');
    
        console.log(`Transaction has been evaluated, result is: ${a_result.toString()} , ${b_result.toString()}`);
        res.json({'a_amount':a_result.toString(),'b_amount':b_result.toString()});
    }catch(e){
        console.log(e);
        res.json({'msg':'query error'});
    }
    }
);
 
/* POST */
router.post('/send', async (req, res, next) => {
    try{
     // Create a new file system based wallet for managing identities.
     const walletPath = path.join(process.cwd(), 'wallet2');
     const wallet = new FileSystemWallet(walletPath);
     console.log(`Wallet path: ${walletPath}`);

     // Check to see if we've already enrolled the user.
     const userExists = await wallet.exists('user1');
     if (!userExists) {
         console.log('An identity for the user "user1" does not exist in the wallet');
         console.log('Run the registerUser.js application before retrying');
         return;
     }

     // Create a new gateway for connecting to our peer node.
     const gateway = new Gateway();
     await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

     // Get the network (channel) our contract is deployed to.
     const network = await gateway.getNetwork('mychannel');

     // Get the contract from the network.
     const contract = network.getContract('send_money');

     // Submit the specified transaction.     
     await contract.submitTransaction('invoke', 'a', 'b', '1');
     console.log('Transaction has been submitted');

     // Disconnect from the gateway.
     await gateway.disconnect();

    console.log(`Transaction has been submitted`);
    res.json({'msg':'ok'});
    }catch(e){
    console.log(e);
    res.json({'msg':'send error'});
    }
    }
    );

module.exports = router;  
