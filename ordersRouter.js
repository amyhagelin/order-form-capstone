const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Orders} = require('./ordersModels');

router.get('/', (req, res) => {
  Orders
  	.find()
  	.then(data => {
		  res.json(data);  
  	})
  	.catch(err => {
		  res.status(500).send('Something went wrong');
	 });
});

router.get('/:id', (req, res) => {
  // res.send(req.params.id);
  // TODO: add searching by id (see blogapi for example)
    Orders
    .findById(req.params.id)
    .exec()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});

router.post('/', jsonParser, (req,res) => {
  ['name', 'email', 'phone'].forEach((field) => {
  	if (!(req.body[field])) {
      const message = `Missing \`${field}\` in request body.`
      console.error(message);
      return res.status(400).send(message);
    }
  })

	Orders
		.create(req.body)
		.then(document => {
			res.status(201).json(document);
		})
		.catch(err => {
			console.error(err);
			res.status(500).send('Something went wrong');
		});
});

router.delete('/:id', (req, res) => {
  Orders
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log(`Deleted blog post \`${req.params.id}\``);
      res.status(204).end()
    })
    .catch(err => {
			res.status(500).send('Something went wrong');
	});
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'email', 'phone'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body.`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body._id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body._id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  // console.log(`Updating order \`${req.params.id}\``);
   
 //   const toUpdate = {};
 //   const updateableFields = {
	//    	name,
	//    	email,
	//    	phone,
	//    	pickupDate,
	//     pickupTime, 
	//     cakeServings,
	//     cupcakeServings,
	//     cakeFlavor,
	//     frostingFlavor,
	//     decoration,
	//     message,
	//     requests
	// };
 //    updatableFields.forEach(field => {
 //      if (field in req.body) {
 //        toUpdate[field] = req.body[field];
 //      }
 //    });

    Orders
      .findByIdAndUpdate(req.params.id, {$set: req.body})
      .exec()
      .then(() => res.status(204).end())
});


module.exports = router;