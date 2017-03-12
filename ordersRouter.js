const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Orders} = require('./models');

router.get('/', (req, res) => {
  Orders.find().then(data => {
    res.json(data);  
  });  
});

router.post('/', jsonParser, (req,res) => {
	console.log(req.body)
	Orders
		.create(req.body)
		.then(document => {
			res.status(201).json(document);
		})
		.catch(err => {
			res.status(500).send('Something went wrong');
		});
});

module.exports = router;