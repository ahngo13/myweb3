const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
 
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
 
const ccpPath = path.resolve(__dirname, '..' , 'basic_articles', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
 
// Create a new CA client for interacting with the CA.
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new FabricCAServices(caURL);
 
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);
/* GET */
router.get('/connect', async(req, res, next) => {
    try{
        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
 
        }   
 
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
 
            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
 
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import('user1', userIdentity);
            console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
 
        }
 
        res.json({"msg":"ok"});
    }catch(e){
        console.log(e);
        res.json({"msg":"connect error"});
    }
  });
  
 
/* GET */
router.get('/query', async (req, res, next) => {
    try{
    console.log("query a...");
    const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            await res.json({'msg':'연결부터 해주세요'});
            return;
        }
 
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
 
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
 
        // Get the contract from the network.
        const contract = network.getContract('jes_cc_node');
 
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
    console.log("invoke from a to b : ", req.body.amount);
    const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            await res.json({'msg':'연결부터 해주세요'});
            return;
        }
 
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
 
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
 
        // Get the contract from the network.
        const contract = network.getContract('jes_cc_node');
 
        await contract.submitTransaction('invoke','a','b',`${req.body.amount}`);
        const result = await contract.evaluateTransaction('getHistoryForKey','a');
        console.log(`getHistoryForKey:` + result.toString());
        console.log(`Transaction has been submitted`);
        res.json({'msg':'ok', 'result':result.toString()});
    }catch(e){
        console.log(e);
        res.json({'msg':'send error'});
    }
    }
    );
 
    module.exports = router;
