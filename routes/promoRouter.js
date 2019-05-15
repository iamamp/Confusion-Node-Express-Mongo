const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>{ //this code will be executed
    //first no matter which http method is used
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();  //pass on to the code below, method specific
})
.get((req,res,next)=>{
    res.end('Will send all the promos? to you');
})
.post((req,res,next)=>{
    res.end('Will add the promo: '+req.body.name + " as "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT op not supported on /promos');
})
.delete((req,res,next)=>{
    //res.statusCode = 403;
    res.end('Deleting all the promos!');
});

promoRouter.route('/:promoId')  //parameter
.all((req,res,next)=>{ //this code will be executed
    //first no matter which http method is used
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();  //pass on to the code below, method specific
})
.get((req,res,next)=>{
    res.end('Will send '+req.params.promoId+' to you');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("Post method not supported on a parameter "+req.params.promoId);
})
.put((req,res,next)=>{
    res.write('Updating the promo: ' + req.params.promoId + '\n');
    res.end('Will update the promo: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting promo: ' + req.params.promoId);
});


module.exports = promoRouter;