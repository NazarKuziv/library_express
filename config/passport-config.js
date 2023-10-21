const fs = require('fs');
const path = require('path');
const Librarian = require('../models/Librarian');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const opts = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: PUB_KEY,
   algorithms: ['RS256']
};
const strategy = new JwtStrategy(opts, (jwt_payload, done) => {
   Librarian.findOne({ where: { id: jwt_payload.sub } })
      .then((librarian) => {
         if (librarian) {
            console.log("librarian found");
            return done(null, librarian);
         }
         return done(null, false);
      }).catch(err => done(err, null));

});
module.exports = (passport) => {
   passport.use(strategy);
};