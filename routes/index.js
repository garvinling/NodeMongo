
/*
 * GET home page.
 */

exports.index = function(req, res){

  res.render('index', { title: 'Express' });

};

exports.userlist = function(db){

	return function(req,res){

		var collection = db.get('usercollection');
		collection.find({},{},function(e,docs){

			res.render('userlist',{

				"userlist" : docs

			});
		});
	};
};

exports.newuser = function(req,res){


	res.render('newuser',{title:'Add New User'});


};

exports.login = function(req,res){

	res.render('login',{title:'New Login'});


};

exports.auth = function(){

	return function(req,res){

	console.log("LOGGIN IN");

	res.redirect('userlist');

	};
};


exports.adduser = function(db){

	return function(req,res){

		//Get form values.  These rely on name attributes. 
		var userName = req.body.username;
		var userEmail = req.body.useremail;

		//Set collection
		var collection = db.get('usercollection');

		//Submit to the DB
		collection.insert({

			"username":userName,
			"email":userEmail
		}, 

		function(err,doc){


			if(err)
			{
				res.send("There was a problem with the DB");
			}
			else
			{
				res.location("userlist");	//Set so it doesnt say /adduser
				res.redirect("userlist");	//Forward to success page
			}
	});
  }
};



























