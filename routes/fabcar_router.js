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
router.get('/get_all_car', async (req, res, next) => {
    try{
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
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.   
        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction has been evaluated, result is: ${result.toString()} `);
        res.json({'queryAllCars':result.toString()});
    }catch(e){
        console.log(e);
        res.json({'msg':'query error'});
    }
});
 
/* post */
router.post('/get_car', async (req, res, next) => {
    try{
      
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
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.   
        const result = await contract.evaluateTransaction('queryCar', `${req.body.queryName}`);
        console.log(`Transaction has been evaluated, result is: ${result.toString()} `);
        res.json({'queryCar':result.toString()});
    }catch(e){
        console.log(e);
        res.json({'msg':'query error'});
    }    
});

/* post */
router.post('/add_car', async (req, res, next) => {
    try{
        
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
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.   
        await contract.submitTransaction('createCar', `${req.body.car_id}`, `${req.body.car_make}`, `${req.body.car_model}`, `${req.body.car_colour}`, `${req.body.car_owner}`);
        console.log(`Transaction has been evaluated, result is ok`);
        res.json({'code':'1','msg':`${req.body.car_id}가 정상적으로 입력되었습니다`});
    }catch(e){
        console.log(e);
        res.json({'code':'0','msg':`${req.body.car_id} 입력 오류`});
    }    
});

/* post */
router.post('/change_owner', async (req, res, next) => {
    try{
        
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
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction
        await contract.submitTransaction('changeCarOwner', `${req.body.car_id}`,  `${req.body.car_owner}`);
        console.log(`Transaction has been evaluated, result is ok`);
        res.json({'code':'1','msg':`${req.body.car_id}가 정상적으로 변경되었습니다`});
    }catch(e){
        console.log(e);
        res.json({'code':'0','msg':`${req.body.car_id} 변경 오류`});
    }    
});

module.exports = router;
