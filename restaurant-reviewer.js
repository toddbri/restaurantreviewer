/* jshint esversion: 6 */
const express = require('express');
const app = express();
const Promise = require('bluebird');
const pgp = require('pg-promise')({promiseLib: Promise});
const bodyParser = require('body-parser');
const fs = require('fs');
const hbs = require('hbs');
const session = require('express-session');
const bcrypt = require('bcrypt');

var debugMode = true;
var db = pgp({
  database: 'restaurantv2',
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(session({
  secret: 'dangly',
  cookie: {maxAge: 1000000}
}));
app.use((req,resp,next) => {
  resp.locals.session = req.session;
  next();
});

app.use((req,resp,next) => {
  console.log('method: ' + req.method);
  console.log('path: ' + req.path);
  console.log('-----------');
  next();
});

app.use((req,resp,next) => {
  fs.appendFile('restaurant-request-log-file.txt',req.method + req.path + '\n' + '-----------\n');
  next();
});

app.get('/', (req,resp) => resp.redirect('/home.html'));

app.get('/search', (req,resp,next) => {
  dl('entering /search');
  db.query(`select * from restaurant where category ilike $1 or name ilike $1`,`%${req.query.searchTerm}%`)
    .then((data) => resp.render('search_results.hbs', {results: data, title: 'Search Results'}))
    .catch(next);
  dl('exiting /search');
});

app.post('/create_account',(req,resp,next) => {
    dl("entering createaccount");
      var dataGood = true;
      for (var i in req.body){
        dataGood = dataGood && (i.length === 0);
      }
      dl('dataGood: ' + dataGood);
      if (dataGood){
        var pwd = req.body.userPassword;
        bcrypt.hash(pwd,10)
        .then(function(encryptedPassword){
          console.log(encryptedPassword);
        var insert_string = `insert into reviewer (id,reviewer_name,reviewer_email,karma,password,first_name,last_name)
          values (default,$1,$2,$3,$4,$5,$6) returning id`;

          var params = [req.body.userName,req.body.email, 0, encryptedPassword, req.body.firstName,req.body.lastName];
          dl('params: ' + params);
          let p1 = db.one(insert_string, params);
          return p1;
        })
        .then((data) => {
          console.log(data);
          if (data.id>0){
            resp.redirect(`/login`);
          }
        })
        .catch((err) => resp.send('There was a problem creating your account' + err.message));
      } else {
        resp.redirect(`/login`);
      }

    dl('exiting createaccount');
});

app.post('/submitReview/:id',(req,resp,next) => {
    dl("entering submitReview");
    if (req.session.loggedIn){
      dl('userID: '+ req.session.userid);
      var insert_string = `insert into review (id,reviewer_id,stars,review,restaurant_id,title)
      values (default,$1,$2,$3,$4,$5) returning id`;
      var params = [req.session.userid,req.body.stars, req.body.reviewText, req.params.id, req.body.reviewTitle];
      let p1 = db.one(insert_string, params);
      p1.then((data) => {
        if (data.id>0){
          resp.redirect(`/restaurant/${req.params.id}`);
        }
      })
      .catch(() => resp.send('There was a problem submitting your review'));
    } else {
      resp.redirect('/');
    }
    dl('exiting submitReview');
});

app.post('/restaurant/submit_new',(req,resp,next) => {
  dl("entering submit_new restaurant");
  if (req.session.loggedIn){
      var insert_string = `insert into restaurant (id,name,address,category) values (default,$1,$2,$3) returning id`;
      var params =[req.body.restaurantName,req.body.restaurantAddress,req.body.restaurantCategory ];
      dl('is: ' + insert_string);
      let p1 = db.one(insert_string, params);
      p1.then((data) => {
        dl('id returned: ' + data.id);
        if (data.id>0){
          resp.redirect(`/restaurant/${data.id}`);
        }
      })
      .catch(function(){resp.send('There was a problem submitting your entry');});
  } else {
    dl("path: " + req.path);
      req.session.referrer = req.path;
      dl("session-referrer: " + req.session.referrer);
      resp.redirect('/login');
  }
  dl("exiting submit_new restaurant");
});

app.post('/checkusername', (req,resp,next) => {
  dl("entering checkusername");
  dl('data sent: ' + req.body.username);
  let p1 = db.one(`select * from reviewer where reviewer_name ilike $1`,req.body.username)
    .then((data) => resp.send(true)
    )
    .catch((err) => resp.send(false));

  dl('leaving checkusername');

});

app.get('/addreview/:id',(req,resp,next) => {
  dl("entering addreview");
  if (req.session.loggedIn === true){
    let p1 = db.one(`select * from restaurant where id = $1`,req.params.id)
      .then((data) => {resp.render('add_review.hbs',{data:data,title: data.name});
      })
      .catch(next);
  } else {
  dl("path: " + req.path);
    req.session.referrer = req.path;
    dl("session-referrer: " + req.session.referrer);
    resp.redirect('/login');
  }
    dl('leaving addreview');
});

app.get('/login', (req,resp,next) => {
  resp.render('login.hbs', {title: 'Login', messagePassed: false});

});

app.post('/process_login', (req,resp,next) => {
  dl('referred from: ' + req.session.referrer);
  dl('user: ' + req.body.userName);
  db.one(`select * from reviewer where reviewer_name ilike $1`,[req.body.userName])
    .then((data) => {
      dl('data returned from db query: ' + data);
      dl('password entered: ' + req.body.userPassword);
      dl('encryptedPassword: '+ data.password);
    bcrypt.compare(req.body.userPassword,data.password)
      .then((matched) => {
          dl('matched: ' + matched);
          if (matched){
            req.session.loggedIn = true;
            req.session.username = data.reviewer_name;
            req.session.userid = data.id;
            dl('returned user id: ' + data.id);
            dl('session userid: ' + req.session.userid);
            dl("redirect to: " + req.session.referrer);
            resp.redirect(req.session.referrer);
          } else {
            resp.render('login.hbs',{title: 'Login failed', messagePassed: true, message: `that username and password combination doesn't work, retry`});
          }
          })
      .catch((err) => {
        dl(err.message);
        resp.send("in the catch");
      });

    })
        //

    .catch((err) => {
      dl(err.message);
      resp.render('login.hbs',{title: 'Login failed', messagePassed: true, message: `that username and password combination doesn't work, retry`});
    });

});

app.get('/restaurant/new',function(req,resp,next){
  dl("entering addrestaurant");
  if (req.session.loggedIn){
    resp.render('add_restaurant.hbs',{title: 'Add Restaurant'});
  } else {
    dl("path: " + req.path);
    req.session.referrer = req.path;
    dl("session-referrer: " + req.session.referrer);
    resp.redirect('/login');
  }
  dl('leaving addrestaurant');
});

app.get('/restaurant/:id',function(req,resp,next){
  var restaurant_id = req.params.id;
  dl("restaurant_id: " + restaurant_id);
  let p1 = db.one(`select * from restaurant where id = $1`,restaurant_id);
  let p2 = db.query(`select * from review join restaurant on review.restaurant_id = restaurant.id join reviewer on reviewer.id = review.reviewer_id where restaurant.id = $1`, restaurant_id);

  Promise.all([p1,p2])
  .spread((r1,r2) => {
    var hasReviews = true;
    if (r2.length === 0){
      dl('no reviews');
      hasReviews = false;
    }
    resp.render('restaurant.hbs',{ r1: r1, reviews: r2, title:r1.name, hasReviews:hasReviews});
  })
  .catch(next);

});

app.get('/logout',(req,resp,next) => {
  dl("in logout");
  req.session.loggedIn = false;
  dl("loggedIn: " + req.session.loggedIn);
  resp.redirect('/');
});

app.get('/:catchall',(req,resp,next) => resp.redirect('/'));

app.listen(8080,function(){dl("listening on 8080");});

const dl = (message) => {
  if (debugMode){
    console.log(message);
  }
};




q=1;
