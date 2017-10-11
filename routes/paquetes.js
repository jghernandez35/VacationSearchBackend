var express = require("express");
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

router.use((req, res, next) => {
    req.collection = req.db.collection('paquetes');
    next();
});

// router.get("/",(req, res, next)=>{
//     res.send({msg:"Entro al metodo GET"});
// });

router.get("/", (req, res, next) => {
    req.collection.find().toArray()
        .then(result => {
            res.send(result);
        });
});

// router.get("/:id",(req, res, next)=>{
//     let id = req.params.id;
//     res.send({msg:"Entro al metodo GET con id "+ id});
// });

router.get("/:id", (req, res, next) => {
    let id = req.params.id;
    req.collection.findOne({ _id: new ObjectID(id) })
        .then(result => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send({ err: "Paquete no encontrado" });
            }
        })
		.catch(err =>{
        res.status(500).send({err:"Error al leer paquetes"});
    });
});

// router.post("/",(req, res, next) => {
//     let body = req.body;
//     res.send({msg:"Entro al metodo POST", body: body });
// });

router.post("/", (req, res, next) => {
    let body = req.body;
    req.collection.insertOne(body)
        .then(result => {
            res.send({ success: true });
        }).catch(err => {
            res.send({ success: false });
        });
});

// router.put("/:id",(req, res, next) => {
//     let body = req.body;
//     res.send({msg:"Entro al metodo PUT", body: body });
// });

router.put("/:id", (req, res, next) => {
    let body = req.body;
    let id = new ObjectID(req.params.id);
    req.collection.updateOne({ _id: id }, { $set: body })
        .then(result => res.send({ success: true }))
        .catch(err => res.send({ success: false }));
});

// router.delete("/:id",(req, res, next) => {
//     let id = req.params.id;
//     res.send({msg:"Entro al metodo DELETE con id "+ id});    
// });

router.delete("/:id", (req, res, next) => {
    let id = new ObjectID(req.params.id);
    req.collection.deleteOne({ _id: id })
        .then(result => res.send({ success: true }))
        .catch(err => res.send({ success: false }));
});

module.exports = router;