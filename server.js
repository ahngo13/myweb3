const express=require("express");
const path=require("path");
const app=express(); 
 
app.use(express.static(path.join(__dirname,"/public")));
 
app.use(express.json());
const basic_network_router=require('./routes/basic_network_router');
app.use('/basic_network', basic_network_router);
const first_network_router=require('./routes/first_network_router');
app.use('/first_network', first_network_router);
const fabcar_router=require('./routes/fabcar_router');
app.use('/fabcar_network', fabcar_router);
 

app.listen(3000,function(){
    console.log("3000 server ready...");
});
