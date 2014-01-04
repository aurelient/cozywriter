var http = require('http'),
    express = require('express'),
    app = express(),
    Schema = require('jugglingdb').Schema,
    db = new Schema('cozy-adapter', { url: 'http://localhost:9101/' });

/* We add configure directive to tell express to use Jade to
render templates */
app.configure(function() {
    app.set('views', __dirname + '/client');
    app.engine('.html', require('jade').__express);
    
    app.use(express.static(__dirname + '/public'));

    // Allows express to get data from POST requests
    app.use(express.bodyParser());
});

// We define our data schema
Note = db.define('notes', {
    "id": String,
    "title": String,
    "content": String,
    "date": Date
});

// Define the request. You need to do this only once.
var request = function(doc) {
      return emit(doc._id, doc);
};
Note.defineRequest("all", request, function(err) {
    if(err != null) {
        console.log("An error occurred while declaring the request -- " + err);
    }
});

// We render the templates with the data
app.get('/', function(req, res) {
    Note.request("all", {}, function(err, notes) {
        if(err != null) {
            console.log("An error has occurred -- " + err);
        }
        else {
            data = {"notes": notes}
            res.render('index.jade', data, function(err, html) {
                res.send(200, html);
            });
        }
    });
});

// We define a new route that will handle note creation
app.post('/add', function(req, res) {
    Note.create(req.body, function(err, note) {
        if(err != null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.redirect('back');
        }
    });
});

// We define another route that will handle note deletion
app.get('/delete/:id', function(req, res) {
    Note.find(req.params.id, function(err, note) {
        if(err != null) {
            res.send(500, "Note couldn't be retrieved -- " + err);
        }
        else if(note == null) {
            res.send(404, "Note not found");
        }
        else {
            note.destroy(function(err) {
                if(err != null) {
                    res.send(500, "An error has occurred -- " + err);
                }
                else {
                    res.redirect('back');
                }
            });
        }
    });
});

/* This will allow Cozy to run your app smoothly but
it won't break other execution environment */
var port = process.env.PORT || 9250;
var host = process.env.HOST || "127.0.0.1";

// Starts the server itself
var server = http.createServer(app).listen(port, host, function() {
    console.log("Server listening to %s:%d within %s environment",
                host, port, app.get('env'));
});