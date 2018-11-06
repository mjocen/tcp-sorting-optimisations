const constants = require("../constants");

function defaultSort(tasks) {
	if (tasks.length < 2)
		return tasks;

	let grouped = {};

	//Group all tasks into arrays of the same priority.
	for (let task of tasks) {
		if (! grouped.hasOwnProperty(task.priority))
			grouped[task.priority] = [];
		grouped[task.priority].push(task);
	}

	//Convert back from an object to an array.
	let groupedArr = [];
	for (let group in grouped)
		groupedArr.push(grouped[group]);

	//Sort each array of tasks that share the same priority by date_completion_due
	//so that the items due soonest are pushed to the top of the array group.
	//Push the results into a new array where the groups are again forgotten.
	let newTasks = [];
	for (let group of groupedArr) {
		group.sort(function(a, b) {
			let dca = parseInt(a.date_completion_due);
			let dcb = parseInt(b.date_completion_due);
			if (dca === dcb)
				return 0;
			return (dca < dcb ? -1 : 1);
		});

		for (let task of group)
			newTasks.push(task);
	}

	//If there is any single task with the status IN_PROGRESS, pull it to the
	//very top of the array of tasks (as in progress tasks should _always_
	//be at the top of a users task list.
	for (let i=0; i<newTasks.length; ++i) {
		if (parseInt(newTasks[i].status) == constants.TASK_STATUS_IN_PROGRESS) {
			let a = newTasks[i];
			newTasks.splice(i, 1);
			newTasks.unshift(a);
			break; //Only one task can ever be active at a time, so don't keep spinning after a match is found.
		}
	}

	//Finally, any task that has it's status as GROUP_WAIT should always
	//be sent to the bottom of the users task list (as the task is not
	//active until someone else triggers it).
	let normalTasks = [];
	let awaitingTasks = [];
	for (let i=0; i<newTasks.length; ++i) {
		if (parseInt(newTasks[i].status) == constants.TASK_STATUS_GROUP_WAIT)
			awaitingTasks.push(newTasks[i]);
		else
			normalTasks.push(newTasks[i]);
	}

	//Concat the awaiting tasks on the end of normal tasks, and thus ensure
	//they are always at the bottom.
	normalTasks.concat(awaitingTasks);

	return normalTasks;

}

module.exports = defaultSort;
