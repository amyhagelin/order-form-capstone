// it('should return 2', function(){
// 	expect(1 + 1).to.equal(1);
// })

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const {closeServer, runServer, app} = require('../server');

describe('blog posts API resource', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	})


	it('should return status code of 200', function() {
		return chai.request(app)
			.get('/')
			.then(function(res) {
				console.log('response')
				res.should.have.status(200);
				// console.log(res.body.length, count)
				// res.body.should.have.length.of(10);
			})
	});

});