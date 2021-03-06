
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');


//Adding MongoDB line (Using NodeLogin_1 as DB)
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/NodeLogin_1');
var app = express();
var hash = require('./pass').hash;


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'views/')));

app.use(express.bodyParser());
app.use(express.cookieParser('shhhhh'));
app.use(express.session());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);

app.get('/users', user.list);
app.get('/userlist',routes.userlist(db));

//handle creating a new user: write to the dB
app.get('/newuser',routes.newuser);
app.post('/adduser',routes.adduser(db));
app.post('/login',routes.auth());
app.get('/login',routes.login);


app.get('/',function(req,res){

	res.redirect('login');

});


function restrict(req,res,next){

	if(req.session.user)
	{
		next();
	}
	else
	{
		req.session.error = 'Access Denied';
		res.redirect('/login');
	}
}

app.get('/collections',function(req,res){
  db.driver.collectionNames(function(e,names){
    res.json(names);
  })
});

app.get('/restricted',restrict,function(req,res){
	res.send('Wahoo! Restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout',function(req,res){
	req.session.destroy(function(){
		res.redirect('/');
	});
});


//Session message middleware
app.use(function(req,res,next){
	var err = req.session.error, 
		msg = req.session.success;
	delete req.session.error;
	delete req.session.success;
	res.locals.message = '';
	if(err) res.locals.message = '<p class="msg error">' + err + '</p>';
	if(msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
	next();
});



//Define authentication function
function authenticate(name,pass,fn){

	if(!module.parent) console.log('Authenticating %s:%s',name,pass);
	var users = db.get('usercollection');

}

function test(req,res){

	var users = db.get('usercollection');
	users.findOne({ username: 'gling' }).on('success', function (doc) {
		console.log(doc.email);
	});
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





















