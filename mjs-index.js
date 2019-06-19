#!/usr/bin/env node

// standard const statements used in my js script files 
// parsing arguments for input in this case, number of floors, elevators, max numb trips befor maint, etc.
const program = require('commander');
const {prompt} = require('inquirer');

//elevator control JS requirement
const Controller = require('./mjs-controller');

// aka main for elevator control instance
program
    .version('1.0.0')  // use major.minor.path terminology so in this case 1.0.0
    .option('-f --floors', 'number of floors')
    .option('-e --elevators', 'number of elevators')
    .option('-t --trips', 'max  number of elevator trips before maintenance is needed')
    .action(() => {
        let controller = new Controller(
            //pass inputs here, for example (3,2,100) for 3 floors, 2 elevators, and 100 max trips before maint
        );
    });

function requestElevator(floor) {
    // call the elevator from a floor
}

function sendElevator(index, floor) {
    // once inside the elevator, send it to the desired floor
}