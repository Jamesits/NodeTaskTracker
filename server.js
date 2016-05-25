var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded(
{
	extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 3000; // set our port
var router = express.Router();

var taskStorage = {
	"projects": [
		{
			"name": "project1",
			"tasks": [
				{
					"name": "task1",
					"start_time": 1464095547
                },
				{
					"name": "task2",
					"start_time": 1464132982
                }
          ]
      }
  ]
};

router.use(function (req, res, next)
{
	// do logging
	console.log('Got request: ', req.method, req.url);
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET
// http://localhost:8080/api)
router.get('/', function (req, res)
{
	res.json(
	{
		message: 'NodeTaskTracker API 0.1'
	});
});

router.route('/tasks')
	.get(function (req, res)
	{
		res.json(taskStorage);
	})
	.post(function (req, res)
	{
		res.json(
		{
			message: 'task updated!'
		});
	});

router.route('/tasks/:project')
	.get(function (req, res)
	{
		res.json(taskStorage.projects.find(function (e)
		{
			return e.name === req.params.project;
		}))
	})
	.post(function (req, res)
	{
		res.json(
		{});
	});

router.route('/tasks/:project/:task')
	.get(function (req, res)
	{
		res.json(taskStorage.projects.find(function (e)
			{
				return e.name === req.params.project;
			})
			.tasks.find(function (e)
			{
				return e.name === req.params.task;
			}))
	});

app.use('/api', router);
app.use(express.static('public'));

// start server
app.listen(port);
console.log('Magic happens on port ' + port);
