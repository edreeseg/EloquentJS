// Measuring a Robot

const compareRobots = (r1, m1, r2, m2) => {
	const r1Results = [];
	const r2Results = [];
	for (let i = 0; i < 100; i++){
		const testState = VillageState.random();
		r1Results.push(runRobot(testState, r1, m1));
		r2Results.push(runRobot(testState, r2, m2));
	}
	r1Avg = r1Results.reduce((a, b) => a + b) / r1Results.length;
	r2Avg = r2Results.reduce((a, b) => a + b) / r1Results.length;
	console.log(`Robot 1 averages ${r1Avg} steps\nRobot 2 averages ${r2Avg} steps`);
}

function runRobot(state, robot, memory) { 
    for (let turn = 0; ; turn++){ 
        if (state.parcels.length == 0){
            return turn; 
        }
        let action = robot(state, memory); 
        state = state.move(action.direction); 
        memory = action.memory; 
    }
}

// Robot Efficiency

function findRoute(graph, from, to){ // Function to determine route for goal-oriented robot.
    let work = [{at: from, route: []}]; // "at" key determines current location of robot, and route array will end up being optimal route.
    for (let i = 0; i < work.length; i++){
        let {at, route} = work[i]; // Destructing assignment of "at" and "route" variables based on specified index of work array.
        for (let place of graph[at]){ // Loop through all possible destinations from current location.
            if (place == to) return route.concat(place); // This function will deal with parcels one at a time.  If one of the currently reachable places is the delivery address, add it to route and return.
            if (!work.some(w => w.at == place)){ // Otherwise, if this location has not already been visited, then we will add it to the work array and "visit" it after the other options have been explored.
                work.push({at: place, route: route.concat(place)}); 
            } // The loop will then restart, moving to the next area in the work array, and seeing if delivery address can be reached from there.
        }
    }
}

function goalOrientedRobot({place, parcels}, route){
    if (route.length == 0){ // If the route's length is 0 (i.e. if function is just starting or if previous route to objective has been completed),
        let parcel = parcels[0]; // Move to the next parcel.
        if (parcel.place != place){ // If the parcel in question is not in the robot's possession,
            route = findRoute(roadGraph, place, parcel.place); // find the route to the parcel, and set that as the robot's route.
        } else { // If the parcel is in the robot's possession,
            route = findRoute(roadGraph, place, parcel.address); // find the route to the parcel's destination address.
        }
    } return {direction: route[0], memory: route.slice(1)}; // After that, being moving in the direction of either of those two destinations, and remove that first move from the beginning of the route.
}