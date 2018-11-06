const fs = require("fs");
const chalk = require("chalk");
const defaultSort = require("./algorithms/default");
const optimisedSort = require("./algorithms/optimised");

const SAMPLE_TEST_SIZE = 50;

//Load the example data from data/*.json.
const data = [];
let files = fs.readdirSync("data");
for (let file of files)
	data.push(require("./data/" + file));


const defaultResults = testSort(data, defaultSort);
const optimisedResults = testSort(data, optimisedSort);
const timeTakenDefault = computeResults(defaultResults);
const timeTakenOptimised = computeResults(optimisedResults);
const accuracy = computeAccuracy(defaultResults[0], optimisedResults[0]);

//Output the result differences.
for (let n=0; n<timeTakenDefault.length; ++n) {
	console.log(`Data set ${n +1}`);
	console.log("-------------------------------------------");
	console.log("Default:");
	console.log(`    Total   (ns): ${timeTakenDefault[n].taken}`);
	console.log(`    Average (ns): ${timeTakenDefault[n].average}`);

	let takenDiff = Math.round(timeTakenOptimised[n].taken - timeTakenDefault[n].taken);
	let takenDiffPerc = ((takenDiff / timeTakenDefault[n].taken) * 100).toFixed(4);
	let averageDiff = Math.round(timeTakenOptimised[n].average - timeTakenDefault[n].average);
	let averageDiffPerc = ((averageDiff / timeTakenDefault[n].average) * 100).toFixed(4);
	let takenStr = (takenDiff < 0 ? chalk.green(`${takenDiff}, ${takenDiffPerc}%`) : chalk.red(`+${takenDiff}, +${takenDiffPerc}%`));
	let averageStr = (averageDiff < 0 ? chalk.green(`${averageDiff}, ${averageDiffPerc}%`) : chalk.red(`+${averageDiff}, +${averageDiffPerc}%`));
	let accuracyStr = (accuracy[n].percent == 100 ? chalk.green(`${accuracy[n].percent}%`) : chalk.red(`${accuracy[n].percent}%`));

	console.log("Optimised:");
	console.log(`    Total   (ns): ${timeTakenOptimised[n].taken} (${takenStr})`);
	console.log(`    Average (ns): ${timeTakenOptimised[n].average} (${averageStr})`);
	console.log(`    Accuracy:     ${accuracyStr}`);
	console.log("\n");
}

/**
 * Run the provided sortFunction on the provided data SAMPLE_TEST_SIZE
 * times, measuring both the result and time taken in nanoseconds.
 * @param {Array} data The array of data to sort.
 * @param {Function} sortFunction The sort function reference to call.
 * @return {Array} An two-dimensional array containing arrays of objects.
 */
function testSort(data, sortFunction) {
	//Make a clone of the data passed in to ensure that if a sorting function
	//modifies the data, it does not effect the actual data source as JS
	//arrays are always pass by reference.
	const localData = data.slice();

	const results = [];
	for (let n=0; n<SAMPLE_TEST_SIZE; ++n) {
		results[n] = [];

		for (let set of localData) {
			let startTime = process.hrtime();
			let result = sortFunction(set);
			let endTime = process.hrtime(startTime);
			results[n].push({
				result: result,
				nanoTaken: endTime[1]
			});
		}
	}

	return results;
}

/**
 * Computes the average time taken in nanoseconds for each data set.
 * @param {Array} results The array of data results.
 * @return {Array} An array of objects containing the total time taken as well
 *                 as the average time taken.
 */
function computeResults(results) {
	const timeTaken = [{total: 0, taken: 0}, {total: 0, taken: 0}, 
		{total: 0, taken: 0}, {total: 0, taken: 0}];

	for (let result of results) {
		for (let n=0; n<data.length; ++n) {
			timeTaken[n].total++;
			timeTaken[n].taken += result[n].nanoTaken;
		}
	}

	for (let n=0; n<timeTaken.length; ++n)
		timeTaken[n].average = (timeTaken[n].taken / timeTaken[n].total);

	return timeTaken;
}

/**
 * Computes the accuracy of two sets by comparing each elements position
 * with it's unique identifier.
 * @param {Array} setA The first set of data.
 * @param {Array} setB The testing set of data.
 * @return {Array} An array of objects containing the total correct ordered
 *                 elements and a percentage of accuracy.
 */
function computeAccuracy(setA, setB) {
	if (setA.length !== setB.length) {
		console.error(chalk.red("Fatal: The result sets are different size."));
		process.exit(1);
	}

	let results = [{total: 0, percent: 0},{total: 0, percent: 0},
		{total: 0, percent: 0},{total: 0, percent: 0}];

	for (let i=0; i<setA.length; ++i) {
		for (let n=0; n<setA[i].result.length; ++n) {
			if (setA[i].result[n].ID == setB[i].result[n].ID)
				results[i].total++;
		}
		results[i].percent = ((results[i].total / setA[i].result.length) * 100).toFixed(4);
	}

	return results;

}
