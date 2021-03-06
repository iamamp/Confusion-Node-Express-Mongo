const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes'); //contains schema definition

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next)=>{
    //res.end('Will send all the dishes to you');
    Dishes.find({}) 
    .then((dishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    //res.end('Will add the dish: '+req.body.name + " as "+req.body.description);
    Dishes.create(req.body) //very very neat!
    .then((dish)=>{
        console.log('Dish created',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT op not supported on /dishes');
})
.delete((req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log('Dish created',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("Post method not supported on a parameter "+req.params.dishId);
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    },{new:true})   //this returns the updated value - this is a mongoose function
    .then((dish)=>{
        console.log('Dish created',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId/comments')
.get((req,res,next)=>{
    //res.end('Will send all the dishes to you');
    Dishes.findById(req.params.dishId) 
    .then((dish)=>{
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish doesnt exist');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    //res.end('Will add the dish: '+req.body.name + " as "+req.body.description);
    Dishes.findById(req.params.dishId) 
    .then((dish)=>{
        if (dish != null) {
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=> next(err));
            //.catch((err)=>next(err));
            //res.json(dish.comments);
        }
        else {
            err = new Error('Dish doesnt exist');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT op not supported on /dishes/'+
    req.params.dishId + '/comments');
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((resp)=>{
        if (dish != null) {
            for(var i = (dish.comments.length-1); i>=0 ;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=> next(err));
        }
        else {
            err = new Error('Dish doesnt exist');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null && dish.comments.id(req.params.commentId)!=null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish==null) {
            err = new Error('Dish doesnt exist');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Dish comment doesnt exist');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("Post method not supported on a parameter "+req.params.commentId);
})
.put((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null && dish.comments.id(req.params.commentId)!=null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=> next(err));
        }
        else if (dish==null) {
            err = new Error('Dish doesnt exist');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Dish comment doesnt exist');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((resp)=>{
        if (dish != null && dish.comments.id(req.params.commentId)!=null) {
                dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=> next(err));
        }
        else if (dish==null) {
            err = new Error('Dish doesnt exist');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Dish comment doesnt exist');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = dishRouter;