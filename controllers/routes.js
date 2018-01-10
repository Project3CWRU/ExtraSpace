var express = require('express');
var db = require('../models');

module.exports = function(app, passport) {

	app.get('/', function(req, res){
	    res.render('home', {user: req.user, message: req.flash()});
	});

	app.post('/spaces/create', function(req, res) {
		var user = req.user;
			db.Space.create({address: req.body.address, ownerFirst: user.firstName, ownerLast: user.lastName, ownerEmail: user.email, city: req.body.city, state: req.body.state, zipcode: req.body.zipcode, type: req.body.type, status: true, description: req.body.description, price: req.body.price, from: req.body.from, to: req.body.to, photo: req.body.photo})
			.then(function(space) {
				user.addSpace(space);
			}).then(function() {
				req.flash('success', 'Your space at ' + req.body.address + ' has been created');
				res.redirect('/profile');
			})
	})

	app.delete('/spaces/delete/:id', function(req, res) {
		db.Space.destroy(
			{
				where: {
					id: req.params.id
				}
			}).then(function() {
			req.flash('delete', 'Your space has been deleted');
			res.redirect('/profile');
		});
	})

	app.put('/spaces/edit/:id', function(req,res) {
		db.Space.update(
			{ 
				address: req.body.address, 
				city: req.body.city, 
				state: req.body.state, 
				zipcode: req.body.zipcode, 
				type: req.body.type, 
				description: req.body.description, 
				price: req.body.price, 
				from: req.body.from, 
				to: req.body.to, 
				photo: req.body.photo
			}, 
			{
				where: {
					id: req.params.id 
				}
			}).then(function() {
			req.flash('edit', "Your space has been edited");
			res.redirect('/profile');
		});
	})

	app.put('/transactions/:id', function(req,res) {
		var user = req.user;
		db.Space.update(
		{
			renterFirst: user.firstName,
			renterLast: user.lastName,
			renterEmail: user.email,
			status: false
		},
		{
			where: {
				id: req.params.id
			}
		}).then(function() {
			db.Space.find(
			{
				where: {
					id: req.params.id
				}
			}).then(function(data) {
				db.Reservation.create({
					address: data.address, ownerFirst: data.ownerFirst, ownerLast: data.ownerLast, ownerEmail: data.ownerEmail, city: data.city, state: data.state, zipcode: data.zipcode, description: data.description, price: data.price, photo: data.photo, from: data.from, to: data.to})
				.then(function(res) {
					user.addReservation(res);
				}).then(function() {
					req.flash('success', 'Your reservation has been created');
					res.redirect('/profile');
				})
			})
		});
	});

	app.get('/spaces', function(req, res){
		if(req.user) {
			req.user.space = {}
			db.Space.findAll({
				where: {
					status: true
				},
				limit: 15,
				order: 'price'
			}).then(function(data) {
				console.log(data);
				for(var i = 0; i < data.length; i++){
					var start = data[i].dataValues.from.toString().substring(4, 15);
					var end = data[i].dataValues.to.toString().substring(4, 15);
					data[i].dataValues.from = start.substring(0, 6) + ',' + start.substring(6, start.length);
 					data[i].dataValues.to = end.substring(0, 6) + ',' + end.substring(6, end.length);
 				}
				req.user.space = data;
				res.render('spaces', {user: req.user});
			});
		} else {
			db.Space.findAll({
				where: {
					status: true
				},
				limit: 15,
				order: 'price'
			}).then(function(data) {
				console.log(data);
				for(var i = 0; i < data.length; i++){
					var start = data[i].dataValues.from.toString().substring(4, 15);
					var end = data[i].dataValues.to.toString().substring(4, 15);
					data[i].dataValues.from = start.substring(0, 6) + ',' + start.substring(6, start.length);
 					data[i].dataValues.to = end.substring(0, 6) + ',' + end.substring(6, end.length);			}
				res.render('spaces', {space: data});
			})
		}
	});

	app.get('/space/:id', isLoggedIn, function(req, res) {
		db.Space.find({where: {id: req.params.id}})
		.then(function(data) {
			data.dataValues.from = data.dataValues.from.toString().substring(4, 15);
			data.dataValues.to = data.dataValues.to.toString().substring(4, 15);
			req.user.space = data;
			res.render('space', {user: req.user});
		})
	})

	app.get('/spaces/search/', function(req, res){
		var query = {status: true};
		var sortBy = "price";
		var limit = 15;
		for(key in req.query){
			if(req.query[key] != '' && key != "sort" && key != "limit"){
				query[key] = req.query[key];
			}
		}

		if(req.query.limit != '' && req.query.limit != undefined){
			limit = parseInt(req.query.limit);
		}

		if(req.query.sort != 'price' && req.query.sort != undefined){
			sortBy = req.query.sort;
		}
		db.Space.findAll({
			where: query,
			limit: limit,
			order: sortBy
		}).then(function(data){
			for(var i = 0; i < data.length; i++){
				data[i].dataValues.from = data[i].dataValues.from.toString().substring(4, 15);
				data[i].dataValues.to = data[i].dataValues.to.toString().substring(4, 15);
			}
			res.render('spaces', {space: data});
		});
	});

	app.get('/profile', isLoggedIn, function(req, res){
		var spaceQueries = [];
		var resQueries = [];
		req.user.space = [];
		req.user.res = [];
		db.Space.findAll({where: {userId: req.user.id}}).then(function(data) {
			for(var i = 0; i < data.length; i++){
				data[i].dataValues.from = data[i].dataValues.from.toString().substring(4, 15);
				data[i].dataValues.to = data[i].dataValues.to.toString().substring(4, 15);
			}	
			data.forEach(function(space) {
				spaceQueries.push(space);
			})
			Promise.all(spaceQueries).then(function(result) {
				for(var i=0; i<result.length; i++) {
					req.user.space.push({
						space_id: result[i].id,
						space_renterFirst: result[i].renterFirst,
						space_renterLast: result[i].renterLast,
						space_renterEmail: result[i].renterEmail,
						space_address: result[i].address,
						space_city: result[i].city,
						space_state: result[i].state,
						space_zipcode: result[i].zipcode,
						space_type: result[i].type,
						space_description: result[i].description,
						space_price: result[i].price,
						space_to: result[i].to,
						space_from: result[i].from,
						space_status: result[i].status,
						space_photo: result[i].photo
					})
				}
				db.Reservation.findAll({where: {userId: req.user.id}}).then(function(rdata) {
					for(var i=0; i<rdata.length; i++) {
						rdata[i].dataValues.from = rdata[i].dataValues.from.toString().substring(4,15);
						rdata[i].dataValues.to = rdata[i].dataValues.to.toString().substring(4,15);
					}
					rdata.forEach(function(res) {
						resQueries.push(res);
					})
					Promise.all(resQueries).then(function(resresult) {
						for(var i=0; i<resresult.length; i++) {
							req.user.res.push({
								res_id: resresult[i].id,
								res_ownerFirst: resresult[i].ownerFirst,
								res_ownerLast: resresult[i].ownerLast,
								res_ownerEmail: resresult[i].ownerEmail,
								res_address: resresult[i].address,
								res_city: resresult[i].city,
								res_state: resresult[i].state,
								res_zipcode: resresult[i].zipcode,
								res_type: resresult[i].type,
								res_description: resresult[i].description,
								res_price: resresult[i].price,
								res_to: resresult[i].to,
								res_from: resresult[i].from,
								res_status: resresult[i].status,
								res_photo: resresult[i].photo
							})
						}
						res.render('profile', {
							user: req.user, message: req.flash()
						});
					})
				})
			})
		});
	});

	app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/google',
    passport.authenticate('google', { scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}

  //  /oauth2callback
  ));
  app.get('/auth/google/callback',
    passport.authenticate('google'), function(req,res) { 
      res.redirect(req.session.returnTo);
      delete req.session.returnTo;
  	}
	);

	app.use(function (req, res){
		res.redirect('/');
	});
}

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();
  req.session.returnTo = req.path;
  // if they aren't redirect them to the home page
  req.flash('notLoggedIn', 'Please log in');
  res.redirect('/auth/google');
}