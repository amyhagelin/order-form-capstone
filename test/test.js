
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const {Orders} = require('../ordersModels');
const {User} = require('../usersModels');

const {closeServer, runServer, app} = require('../server');

describe('Orders API resource', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	})

	// GET TEST
	it('should return all orders', function() {
			let res;
			return chai.request(app)
				.get('/orders')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					// console.log(res.body.length, count)
					// res.body.should.have.length.of(10);
				})
		});

	// POST TEST

	function generateOrder() {
			return {
				name: 'Test Name',
				email: 'name@fakeemail.com',
				phone: '123-456-7890',
				pickupDate: '03/12/17',
			    pickupTime: '03/24/17',
			    cakeServings: 12,
			    cupcakeServings: 12,
			    cakeFlavor: 'chocolate',
			    frostingFlavor: 'vanilla',
			    decoration: 'pink and yellow flowers',
			    message: 'Happy Birthday',
			    requests: 'include package of 12 candles'
			}
		}

	const newOrder = generateOrder()

		it('should create a new order', function() {
			return chai.request(app)
				.post('/orders')
				.send(newOrder)
				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys('name', 'email', 'phone');
					res.body.name.should.equal(newOrder.name);
					res.body._id.should.not.be.null;
					res.body.email.should.equal(newOrder.email);
					res.body.phone.should.equal(newOrder.phone);
					return Orders.findById(res.body._id);
				})
				.then(function(orders) {
					orders.name.should.equal(newOrder.name);
					orders.email.should.equal(newOrder.email);
					orders.phone.should.equal(newOrder.phone);
				});
		})

// PUT TEST

	const updateData = {name: 'Updated Name', email: 'updated@email.com', phone: '123456789'};

		it('should update an existing order', function() {
			return Orders
			.findOne()
			.exec()
			.then(function(order){
				updateData._id = order._id;
				return chai.request(app)
					.put(`/orders/${order._id}`)
					.send(updateData);
			})
			.then(function(res){
				res.should.have.status(204);

				return Orders.findById(updateData._id).exec();
			})
			.then(function(order) {
				order.name.should.equal(updateData.name);
				order.email.should.equal(updateData.email);
				order.phone.should.equal(updateData.phone);
			});
		})


	// DELETE TEST
	it('should delete an order', function() {

		let orderTemp;

		return Orders
			.findOne()
			.exec()
			.then(function(order) {
				orderTemp = order;
				return chai.request(app).delete(`/orders/${order._id}`);
			})
			.then(function(res){
				res.should.have.status(204);
				return Orders.findById(orderTemp._id).exec();
			})
			.then(function(order){
				should.not.exist(order);
			})	
	})


	// POST /users
	// --> test if you can receive 200 with correct data
	// --> test for 422 with some incorrect data

	function generateUser() {
		return {
			username: `testusername-${Date.now()}`,
			password: "testpassword",
			firstName: "Firstname",
			lastName: "Lastname"
		}
	}

	const newUser = generateUser();
	let newUserId = null;

	it('should create a new user', function() {
		return chai.request(app)
			.post('/users')
			.send(newUser)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('username', 'firstName', 'lastName');
				res.body.username.should.equal(newUser.username);
				res.body._id.should.not.be.null;
				res.body.firstName.should.equal(newUser.firstName);
				res.body.lastName.should.equal(newUser.lastName);
				newUserId = res.body._id;	
				console.log(newUserId);
				return User.findById(res.body._id);
			})
			.then(function(user) {
				user.username.should.equal(newUser.username);
				user.firstName.should.equal(newUser.firstName);
				user.lastName.should.equal(newUser.lastName);
			});
	})

	// DELETE TEST
	it('should delete a user', function() {

		let userTemp;

		return User
			.findById(newUserId)
			.exec()
			.then(function(user) {
				userTemp = user;
				return chai.request(app).delete(`/users/${user._id}`);
			})
			.then(function(res){
				res.should.have.status(204);
				return User.findById(userTemp._id).exec();
			})
			.then(function(user){
				should.not.exist(user);
			})	
	})

	
	// GET /users/me
	// --> test if you can receive 200 with correct username/password
	// --> test if you can't login withouth correct username/password
	



});