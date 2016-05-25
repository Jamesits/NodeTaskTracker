function renderTaskList(data)
{
	var template = '<ul> \
        {{#projects}} \
            <li><input type="checkbox"></input>{{name}} \
                <ul> \
                    {{#tasks}} \
                        <li><input type="checkbox"></input> \
                            {{name}}: \
                            {{start_time}}</li> \
                    {{/tasks}} \
                </ul> \
            </li> \
        {{/projects}} \
    </ul>'
	return Mustache.render(template, data);
}

function applyTaskList(html)
{
	document.getElementById("tasklist")
		.innerHTML = html;
}

function getTaskList()
{
	var request = new XMLHttpRequest();
	request.open('GET', '/api/tasks', true);

	request.onload = function ()
	{
		if (this.status >= 200 && this.status < 400)
		{
			// Success!
			var data = JSON.parse(this.response);
			applyTaskList(renderTaskList(data));
		}
		else
		{
			console.log(this.response);

		}
	};

	request.onerror = function ()
	{
		console.log(this.response);
	};

	request.send();
}

(function ready(fn)
{
	if (document.readyState != 'loading')
	{
		fn();
	}
	else
	{
		document.addEventListener('DOMContentLoaded', fn);
	}
})(function ()
{
	getTaskList();
});
