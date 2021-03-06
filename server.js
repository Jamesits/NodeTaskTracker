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

// ======= model ========
// There are some dummy data used to debug.
// Remove them before production.
// var taskStorage = {"projects":[]};
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

function getProject(proj) {
    return taskStorage.projects.find(function (e)
    {
        return e.name === proj;
    })
};

function getTask(proj, task) {
    return taskStorage.projects.find(function (e)
        {
            return e.name === proj;
        })
        .tasks.find(function (e)
        {
            return e.name === task;
        })
};
// ======= model ========

router.use(function (req, res, next)
{
	// do logging
	console.log('Got request: ', req.method, req.url, "\n", req.body);
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET
// http://localhost:3000/api)
router.get('/', function (req, res)
{
	res.json(
	{
		message: 'NodeTaskTracker API'
	});
});

router.route('/tasks')
	// get everything
	.get(function (req, res)
	{
		res.json(taskStorage);
	})
	// add project
	.post(function (req, res, next)
	{
        var t = getProject(req.body.name);
        if (typeof t !== 'undefined') return res.status(500).json({"message": "Already exists"});
				taskStorage.projects.push(
				{
					"name": req.body.name,
					"tasks": []
				});
				res.status(201).json(
				{
					message: 'task added!'
				});
	});

router.route('/tasks/:project')
	// get task under a project
	.get(function (req, res)
	{
		var t = getProject(req.params.project);
        if (typeof t === 'undefined') return res.status(404).json({ "message": 'Not found' });
		res.json(t);
	})
	// modify project name
	.put(function (req, res, next)
	{
        var t = getProject(req.params.project);
        if (typeof t === 'undefined') return res.status(404).json({ "message": 'Not found' });
        t.name = req.body.name || t.name;
        t.tasks = req.body.tasks || t.tasks;
		res.json(
            {
    			message: 'project modified!'
    		});
	})
	.delete(function (req, res, next)
	{
		var t = getProject(req.params.project);
		if (typeof t === 'undefined') return res.status(404).json({ "message": 'Not found' });
		taskStorage.projects.splice(taskStorage.projects.indexOf(t), 1);
		res.json(
		{
			message: 'project deleted!'
		});
	})
	// add task
	.post(function (req, res, next)
	{
        var t = getTask(req.params.project, req.params.task);
        if (typeof t !== 'undefined') return res.status(500).json({"message": "Already exists"});
        getProject.tasks.push({
            "name": req.body.name,
            "start_time": req.body.start_time
        })
        res.status(201).json(
				{
					message: 'task added!'
				});
	});

router.route('/tasks/:project/:task')
	// get a task
	.get(function (req, res)
	{
		var p = getProject(req.params.project);
		if (typeof p === 'undefined') return res.status(404).json({ "message": 'Project not found' });
		var t = getTask(req.params.project, req.params.task);
        if (typeof t === 'undefined') return res.status(404).json({"message": "Task not found"});
		res.json(t);
	})
	// modify a task
	.put(function (req, res, next) {
		var p = getProject(req.params.project);
		if (typeof p === 'undefined') return res.status(404).json({ "message": 'Not found' });
        var t = getTask(req.params.project, req.params.task);
        if (typeof t === 'undefined') return res.status(404).json({"message": "Not found"});
        t.name = req.body.name || t.name;
        t.start_time = req.body.start_time || t.start_time;
        res.json(
		{
			message: 'task modified!'
		});
    })
	.delete(function (req, res, next) {
		var p = getProject(req.params.project);
		if (typeof p === 'undefined') return res.status(404).json({ "message": 'Not found' });
		var t = getTask(req.params.project, req.params.task);
        if (typeof t === 'undefined') return res.status(404).json({"message": "Not found"});
		p.tasks.splice(p.tasks.indexOf(t), 1);
		res.json(
		{
			message: 'task deleted!'
		});
	});

app.use('/api', router);
app.use(express.static('public'));

// start server
app.listen(port);
console.log('Magic happens on port ' + port);
