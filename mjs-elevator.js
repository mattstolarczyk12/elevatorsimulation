// with strict mode, you can not, for example, use undeclared variables.
'use strict';

// Node JS inheritance required for elevator simulation
const events = require('events');

// elevator states
const STATES = {
    IDLE: 0,
    MOVING: 1,
    MAINTENANCE: 2
}

// elevator directions
const DIRECTIONS = {
    UP: 1,
    STOPPED: 0,
    DOWN: -1
}

// main elevator class defintion and "this..." instance 
class Elevator extends events.EventEmitter {
    constructor(id, maxFloors, maxTrips) {
        this.id = id;
        this.maxFloors = maxFloors;
        this.maxTrips = maxTrips;

        this.currentFloor = 1;
        this.stops = [];

        this.state = STATES.IDLE;
        this.direction = DIRECTIONS.STOPPED;
        this.doorsOpen = false;
        
        this.numTrips = 0;
        this.numFloorsPassed = 0;
    }

	// get elevator id
    getId() {
        return this.id;
    }

	// get current floor of elevator
    getCurrentFloor() {
        return this.currentFloor;
    }

	// get state of elevator
    getState() {
        return this.state;
    }

	// get last stop of elevator
    getLastStop() {
        if( this.stops ) {
            return this.stops[this.stops.length - 1];
        }
        else {
            return -1;
        }
    }

	// boolean return if elevator door open
    isDoorOpen() {
        return this.doorsOpen;
    }

	// call button from current elevator floor and direction request (up | down)
    call(floor, direction) {
        // check for bad input
        if( floor == 1 && this.direction == DIRECTIONS.DOWN ) {
            emit('error', 'Invalid input. Cannot go below floor 1.');
            return;
        }
		// check for above max elevator floor
        else if( floor == this.maxFloors && this.direction == DIRECTIONS.UP ) {
            emit('error', 'Invalid input. Cannot go above floor ' + this.maxFloors);
            return;
        }
		// check if elevator already at floor then open door
        else if( currentFloor === floor ) {
            // direction stopped and open the elevator door
            this.direction = DIRECTIONS.STOPPED;
            openDoors();
            return;
        }
		// elevator need to travel up to given floor
        else if( currentFloor < floor ) {
            // travel up to given floor.
            this.direction = DIRECTIONS.UP;
        }
		// elevator need to travel down to given floor
        else if( currentFloor > floor ) {
            this.direction = DIRECTIONS.DOWN;
        }
		// elevator in moving state and stops on push floor
        this.state = STATES.MOVING;
        this.stops.push( floor );
        move();
    }

	// elevator move method
    move() {

		// loop on elevator movement up or down until stops
        while( this.stops ) {
            let stop = this.stops.shift();
            if( this.direction == DIRECTIONS.UP ) {
                for( let i = this.currentFloor ; i <= stop ; i++ ) {
                    this.numFloorsPassed++;
                    emit('changeFloor', i);
                }
            }
            else if( this.direction == DIRECTIONS.DOWN ) {
                for( let i = this.currentFloor ; i >= stop ; i-- ) {
                    this.numFloorsPassed++;
                    emit('changeFloor', i);
                }
            }
            // elevator reached floor - open the door
            emit('openDoors');
            openAndCloseDoors();
        }
		// elevator completes movement to floor in up or down direction
        endTrip();
    }

	// adding a new floor and direction after elevator stop
    addStop(floor, direction) {
        if( this.stops.indexOf( floor ) < 0 ) {
            // add the stop in the proper order.
            stops.push(floor);
            // now sort the array based on up/down direction.
            if(direction == DIRECTIONS.UP) {
                stops.sort(function(a, b) { return a - b; });
            }
            else {
                stops.sort(function(a, b) { return b - a; });
            }
        }
    }
	// elevator at floor open doors and wait 3 seconds and close door
	// could implement this value in index.js for parameter of elevator control
    openAndCloseDoors() {
        openDoors();
        // wait 3 seconds and then close the doors.
        setTimeout(() => {
            closeDoors();
        }, 3000);
    }
	// open elevator door boolean
    openDoors() {
        this.doorsOpen = true;
        emit('openDoors');
    }
	// close elevator door boolean
    closeDoors() {
        this.doorsOpen = false;
        emit('closeDoors');
    }
	// elevator done trip and check for max trips for maintenance mode
    endTrip() {
        // Check to see if we've reached 100 trips.
        if( this.numTrips == this.maxTrips ) {
            this.state = STATES.MAINTENANCE;
            this.direction = DIRECTIONS.STOPPED;
            emit('maintenance');
        }
		// not in maintenance mode and elevator idle and stopped
        else {
            this.state = STATES.IDLE;
            this.direction = DIRECTIONS.STOPPED;
        }
	// elevator service idle and direction stopped and service completed
    }
    service(timeout) {
        emit('serviceStarted');
        setTimeout(() => {
            this.state = STATES.IDLE;
            this.direction = DIRECTIONS.STOPPED;
            emit('serviceComplete');
        }, timeout);
    }
}