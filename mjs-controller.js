// with strict mode, you can not, for example, use undeclared variables
'use strict';

//elevator implementation
const {Elevator} = require('./mjs-elevator');

//main class and contructor for elevator control
class ElevatorController {

    constructor(numFloors, numElevators, maxTrips) {
        this.maxFloors = numFloors;
        this.maxTrips = maxTrips;

        this.elevators = [];
        this.queue = [];

        // init the elevators
        for( var i = 0 ; i < numElevators ; i++ ) {
            let elevator = new Elevator(i, this.maxFloors, this.maxTrips);

            // register listeners for events.
			// change floors
            elevator.on('changeFloors', (id, floor) => {
                console.log('Elevator', id, 'has reached floor', floor);
            });
			// open doors
            elevator.on('openDoors', (id) => {
                console.log('Elevator', id, 'has opened its doors');
            });
			// close doors
            elevator.on('closeDoors', (id) => {
                console.log('Elevator', id, 'has closed its doors');
            });
			// going offline for maintenance
            elevators.on('maintenance', (id) => {
                console.log('Elevator', id, 'has gone offline for maintenance');
            });
			// service started maintenance
            elevators.on('serviceStarted', (id, timeout) => {
                console.log('Elevator', id, 'has been scheduled for maintenance. Expected downtime is ', timeout, 'ms');
            });
			// service completed maintenance
            elevators.on('serviceCompleted', (id) => {
                console.log('Elevator', id, 'has been serviced and is now available for requests.');
            })
        }
    }

    request(floor) {
        // Pick which elevator we should use
        let index = findClosest(floor);
        let elevator = this.elevators[index];

        // if it is already moving, add a stop
        if( elevator.getState() == STATES.MOVING ) {
            elevator.addStop(floor);
        }
        // start the elevator on a trip
        else {
            elevator.startTrip(floor);
        }
    }

	// method for invalid input < 1 floor or value above max floors
    send(index, floor) {
        if( floor < 1 ) {
            console.error('Invalid input. Cannot go below floor 1.'); 
        }
        else if( floor > this.maxFloors ) {
            console.error('Invalid input. Cannot go above floor' + this.maxFloors + '.'); 
        }
        else {
            elevator.addStop(floor);
        }
    }
	// elevator service timeout
    service(index, timeout) {
        elevators[index].service(timeout);
    }

    // considerations that can be added as needed, handle case where all elevators are in maint mode
	// or error handling on elevators[0], or handling of cased where elevators.stops is empty
	
	// method for elevator motion floor-to-floor
    findClosest(floor) {
        let closest = this.elevators[0];
        for( let i = 1 ; i < this.elevators.length ; i++ ) {

            next = this.elevators[i];

            //if the elevator is in maintenance mode, skip it.
            if( next.getState() == STATES.MAINTENANCE ) {
                continue;
            }
            // check to see if this is in motion and will pass by the target floor.
            else if( next.getState() == states.MOVING ) {
                let lastStop = next.getLastStop();
                if( lastStop === -1 ) {
                    //should only happen near the end of a trip.  continue.
                    continue;
                }
				// in between floors
                if( isBetween( next.getCurrentFloor(), lastStop ) ) {
                    return next.getId();
                }
            }
            // if both are idle, get the closest one
            else if( closest.getState() == states.IDLE &&
                next.getState() == states.IDLE ) {
            
                closestDiff = Math.abs(floor - closest.getCurrentFloor());
                nextDiff = Math.abs(floor - next.getCurrentFloor());

                if( closestDiff <= nextDiff ) {
                    continue;
                }
                else {
                    closest = next;
                }
            }
            // if the closest one is in maintenance, return next.
            else if( closest.getState() == states.MAINTENANCE ) {
                closest = next;
            }
        }
		// return closest elevator
        return closest.getId();
    }

	// method for checking elevator in between floors while getting to destination
    isBetween( floor1, floor2, destination ) {
        if( floor1 > floor2 ) {
            return floor1 >= destination && floor2 <= destination;
        }
        else if( floor1 < floor2 ) {
            return floor1 <= destination && floor2 >= destination;
        }
        else {
            return destination == floor1;
        }
    }
}