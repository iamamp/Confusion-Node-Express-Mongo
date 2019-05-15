const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{ //this code will be executed
    //first no matter which http method is used
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();  //pass on to the code below, method specific
})
.get((req,res,next)=>{
    res.end('Will send all the leaderes to you');
})
.post((req,res,next)=>{
    res.end('Will add the leader: '+req.body.name + " as "+req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT op not supported on /leaderes');
})
.delete((req,res,next)=>{
    //res.statusCode = 403;
    res.end('Deleting all the leaderes!');
});

leaderRouter.route('/:leaderId')
.all((req,res,next)=>{ //this code will be executed
    //first no matter which http method is used
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();  //pass on to the code below, method specific
})
.get((req,res,next)=>{
    res.end('Will send '+req.params.leaderId+' to you');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("Post method not supported on a parameter "+req.params.leaderId);
})
.put((req,res,next)=>{
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting leader: ' + req.params.leaderId);
});


module.exports = leaderRouter;