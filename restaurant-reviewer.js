/* jshint esversion: 6 */
const express = require('express');
const app = express();
const Promise = require('bluebird');
const pgp = require('pg-promise')({promiseLib: Promise});
const bodyParser = require('body-parser');
const hbs = require('hbs');

var db = pgp({
  database: 'restaurantv2',
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'hbs');

app.get('/search', function(req,resp,next){
  let thing = req.query;
  // add code to detect bad search input before submitting the query
  db.query(`select * from restaurant where category ilike '%${thing.searchTerm}%' or name ilike '%${thing.searchTerm}%'`)
    .then(function(data){
      resp.render('search_results.hbs',{results: data, title: 'Search Results'});
    })
    .catch(next);

});

app.post('/submitReview/:id',function(req,resp,next){
  console.log("submitting review");
  // console.log(req.body);
  // console.log(req.body.reviewTitle);
console.log(req.body.stars);
  var insert_string = `insert into review (id,reviewer_id,stars,review,restaurant_id,title)
  values (default,'7','${req.body.stars}','${req.body.reviewText}','${req.params.id }','${req.body.reviewTitle}') returning id`;
  console.log('is: ' + insert_string);
  let p1 = db.one(insert_string);
  console.log('made it past the promise');
  p1.then(function(data){
    console.log('id returned: ' + data.id);
    if (data.id>0){
      resp.redirect(`/restaurant/${req.params.id}`);
    } else {
      // throw new error;
    }
  })
  .catch(function(){resp.send('There was a problem submitting your review');});
});

app.post('/restaurant/submit_new',function(req,resp,next){
  console.log("submitting new restaurant");

  var insert_string = `insert into restaurant (id,name,address,category)
  values (default,'${req.body.restaurantName}','${req.body.restaurantAddress}','${req.body.restaurantCategory }') returning id`;
  console.log('is: ' + insert_string);
  let p1 = db.one(insert_string);
  p1.then(function(data){
    console.log('id returned: ' + data.id);
    if (data.id>0){
      resp.redirect(`/restaurant/${data.id}`);
    }
  })
  .catch(function(){resp.send('There was a problem submitting your entry');});
  console.log("exiting submit new restaurant");
});

// app.get('/', function(req,resp){
//   resp.redirect('/home.html');
// });
app.get('/', (req,resp) => resp.redirect('/home.html'));

app.get('/addreview/:id',function(req,resp,next){
  console.log("entering addreview");
let p1 = db.one(`select * from restaurant where id = '${req.params.id}'`)
  .then(function(data){
    resp.render('add_review.hbs',{data:data,title: data.name});
  })
  .catch(next);
console.log('leaving addreview');
});

app.get('/restaurant/new',function(req,resp,next){
  console.log("entering addrestaurant");
  resp.render('add_restaurant.hbs',{title: 'Add Restaurant'});
  console.log('leaving addrestaurant');
});

app.get('/restaurant/:id',function(req,resp,next){
  var restaurant_id = req.params.id
  console.log("restaurant_id: " + restaurant_id);
  let p1 = db.one(`select * from restaurant where id = '${restaurant_id}'`);
  console.log(`select * from review join restaurant on review.restaurant_id = restaurant.id where restaurant.id = ${restaurant_id}`);
  // let p2 = db.query(`select * from review join restaurant on review.restaurant_id = restaurant.id where restaurant.id = ${restaurant_id}`);
  let p2 = db.query(`select * from review join restaurant on review.restaurant_id = restaurant.id join reviewer on reviewer.id = review.reviewer_id where restaurant.id = ${restaurant_id}`);

  Promise.all([p1,p2])
  .spread(function(r1,r2){
    var hasReviews = true;
    if (r2.length === 0){
      console.log('no reviews');
      hasReviews = false;
    }
    resp.render('restaurant.hbs',{ r1: r1, reviews: r2, title:r1.name, hasReviews:hasReviews});


  })
  .catch(next);

});

app.listen(8080,function(){console.log("listening on 8080");});






q=1;
