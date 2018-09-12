let server = require('../bin/www');
let User = require('../api/models/user');
 
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
let expect = chai.expect;
 
chai.use(chaiHttp);
 
let login_details = {
    "email": "sponge@bob.com",
    "password": "garyTheSnail"
}
 
let register_details = {
    'email': 'sponge@bob.com',
    'password': 'garyTheSnail',
    'fullName': 'SpongeBob SquarePants',
    'displayName': 'SpongeBob',
    'gender' : 'male',
    'dev': 'J',
    'role': 'user'
};

let accessToken;
let userId;

/**
* Test the following in on scoop:
* - Create an account, login with details, and check if token comes
*/
 
describe('Create Account, Login and Check Token', function() {
    before(function(done) {
        //console.log('Deleting user...');
        User.deleteOne({'email':'sponge@bob.com'})
            .then(result => {
                done();
            });
    });

    describe('Login Module', function() {

        it('should deny login to non-existing user', function(done) {
            chai.request(server)
                .post('/api/user/login')
                .send({"email":"hello@hello.com", "password":"hello123"})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.json; 
                    res.body.should.have.property('message');
    
                    done();
                });
        });

        it('should deny access to user protected routes', function(done) {
            chai.request(server)
            .get('/api/user')
            .end((err, res) => {
                // the res object should have a status of 201
                res.should.have.status(401);
                res.should.be.json; 
                res.body.should.have.property('message');
                res.body.message.should.equal('Auth failed!');
                done();
            });
        });

        it('should create a new user', function(done) {
            chai.request(server)
                .post('/api/user/signup')
                .send(register_details)
                .end((err, res) => {
                    // the res object should have a status of 201
                    res.should.have.status(201);
                    res.body.should.have.property('message');
                    res.body.should.have.property('result');
                    res.body.result.should.be.a('object');
                    done();
                });
        });

        it('should login newly created user', function(done)  {
            chai.request(server)
                .post('/api/user/login')
                .send(login_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json; 
                    res.body.should.have.property('token');
                    res.body.should.have.property('expiresIn');
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');

                    accessToken = res.body.token;
                    done();
                });
        });

        it('should validate token and grant access to user protected routes', function(done) {
            chai.request(server)
                .get('/api/user')
                .set('Authorization', "hello " + accessToken)
                .end((err, res) => {
                    // the res object should have a status of 201
                    res.should.have.status(200);
                    res.should.be.json; 
                    res.body.should.have.property('message');
                    res.body.should.have.property('users');
                    res.body.should.have.property('maxUsers');
                    res.body.users.should.be.a('array');
                    done();
                });
        });
    });
})