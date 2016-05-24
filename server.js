var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
var port = process.env.PORT || 3000; // set our port
var router = express.Router();
router.use(function(req, res, next) {
  // do logging
  console.log('Got request: ', req.method, req.url);
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET
// http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({message : 'NodeTaskTracker API 0.1'});
});

router.route('/tasks')
    // create a task (accessed at POST http://localhost:8080/api/tasks)
    .post(function(req, res) {
        res.json({message : 'task created!'});
    })
    // get all the tasks (accessed at GET http://localhost:8080/api/tasks)
    .get(function(req, res) {
      res.json({"project1": {"task1": 1464095547, "task2": 1464132982}});
    })
    // update a task (accessed at PUT http://localhost:8080/api/tasks/:task_id)
    .put(function(req, res) {
          res.json({message : 'task updated!'});
    })
    // delete a task (accessed at DELETE http://localhost:8080/api/tasks/:task_id)
    .delete(function(req, res) {
        res.json({message : 'Successfully deleted'});
    });

app.use('/api', router);

// start server
app.listen(port);
console.log('Magic happens on port ' + port);
