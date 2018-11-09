const constants = require("../constants");


function calcDate(taskA, taskB) {
    let dca = parseInt(taskA.date_completion_due);
    let dcb = parseInt(taskB.date_completion_due);
    if (dca === dcb)
        return 0;
    return (dca < dcb ? -1 : 1);
}
    
function calcPriority(taskA, taskB) {
    let dca = parseInt(taskA.priority);
    let dcb = parseInt(taskB.priority);
    if (dca === dcb)
        return 0;
    return (dca < dcb ? -1 : 1);
}

function optimisedSort(tasks) {

    //Add your sorting code here...
    if (tasks.length < 2)
		return tasks;
    
    let allTasks = [];
    let awaitingTasks = [];
    let remainingTasks = [];
    let grouped = {};
    
    
    //Separate tasks according to status
    for (let task of tasks) {
        if (parseInt(task.status) == constants.TASK_STATUS_IN_PROGRESS) {
            allTasks.push(task)
        } else {
            if (! grouped.hasOwnProperty(task.priority))
                grouped[task.priority] = [];
            grouped[task.priority].push(task);
        }
    }

    let groupedArr = [];
    for (let group in grouped)
        groupedArr.push(grouped[group]);
    
    for (let group of groupedArr) {
        group.sort(calcDate);
        
        for (let task of group) {
            if (parseInt(task.status) == constants.TASK_STATUS_GROUP_WAIT)
                awaitingTasks.push(task);
            else
                remainingTasks.push(task);
        }
    }

    for (let task of awaitingTasks)
        allTasks.push(task);
    
    for (let task of remainingTasks)
        allTasks.push(task);

	return allTasks;
}


module.exports = optimisedSort;
