# Getting started

## Pre-requisites
A fairly modern version of node.js and npm.

## Working
First, create a fork. Then, follow the below (replacing the git URLs with those
of your local fork).

```bash
git clone https://github.com/isdampe/tcp-sorting-optimisations.git
cd tcp-sorting-optimisations
npm install
```

Assuming no errors, you should now be good to go.

To run the test, 

```bash
node sort.js
```

You should get some kind of output like the below.

![sort.js output](output.png)

## Writing your algorithm
Simplify edit the `optimisedSort` method in `algorithms/optimised.js`. Make
sure the method returns the sorted array of tasks.

To see the sorting requirements, read `algorithms/default.js` for the current
implementation.

Use hard tab characters, not spaces!
