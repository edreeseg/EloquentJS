// The robot essentially works by generating a new "state" each time it makes a "move".  So, rather than necessarily
// thinking about a robot actually moving behind the code, you can think of it as being a sequence of snapshots of
// what the map looks like after each of these moves.

const roads = [ // Array of strings indicating roads that connect two places.
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

function buildGraph(edges){ // Builds an object that indicates which locations can be reached from one's current location.
    let graph = Object.create(null); // Create new object with no inherited properties/methods.
    function addEdge(from, to){
        if (graph[from] == null) // If the current location does not exist on object, create it and begin array with first travel option.
            graph[from] = [to];
        else // If the current location does exist, push this new travel option to that array.
            graph[from].push(to);
    }
    for (let [from, to] of edges.map(r => r.split("-"))){ // Splits the array of strings and uses addEdge to create object.
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads); // Call function to build object from initial array of strings.

class VillageState{ // Creates a new state indicating where robot currently is, and parcel details.
    constructor(place, parcels){
        this.place = place; // Current location of the robot.
        this.parcels = parcels; // Array of parcels, structured as follows: {place: [parcel current location], address: [parcel delivery address]}
    }
    move(destination){ // This is a method that handles the actual delivery process of the robot.
        if(!roadGraph[this.place].includes(destination)) // If robot cannot get to its destination from where it currently is, return current state.
            return this;
        else {
            let parcels = this.parcels.map(p => { // 
                if (p.place != this.place) return p; // If the parcel is not currently in the robot's possession or where the robot is located right now, leave as-is.
                return {place: destination, address: p.address}; // Otherwise, move the parcels along with the robot, keeping delivery address the same.
            }).filter(p => p.place != p.address); // If parcel delivery address is where the robot is currently located, remove from the array as it has been delivered.
            return new VillageState(destination, parcels); // Take a new "snapshot", so to speak, of the state after the robot's next move.
        }
    }
}

let first = new VillageState( // New state initialized.
    "Post Office", //Robot currently located at the Post Office.
    [{place: "Post Office", address:"Alice's House"}] // Parcel is currently located at the Post Office, and must be delivered to Alice's House.
);
let next = first.move("Alice's House"); // Move robot to Alice's House, which will cause the parcel to be filtered from the array, as it is delivered.

function runRobot(state, robot, memory) { // Creates a function to actually decide the robot's moves automatically.
    for (let turn = 0; ; turn++){ // Creates loop with no end condition - robot will run until parcels are delivered, and then break statement will be used.
        if (state.parcels.length == 0){
            console.log(`Done in ${turn} turns`); // If all parcels have been delivered, break the loop and log number of turns taken.
            break;
        }
        let action = robot(state, memory); // Let the action the robot takes be determined by which robot we are using, which includes its current state and a memory key that helps dictate decision making.
        state = state.move(action.direction); // The move method's arugment is determined by whatever value is found on the above robot's direction key.
        memory = action.memory; // The robot will "remember" things based on a memory key, the specifics of which are determined by which robot we are using.
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array){ // Basic function for picking an array element randomly.
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state){ // This robot will randomly pick a direction to move in.  It does not require memory because it will always move randomly.
    return {direction: randomPick(roadGraph[state.place])}; // Picks direction randomly from a list of places that can be reached from current location.
}

VillageState.random = function(parcelCount = 5){ // This function determines where the parcels will be located randomly.
    let parcels = [];
    for (let i = 0; i < parcelCount; i++){ // Loop to create number of parcels specified by "parcelCount" argument.
        let address = randomPick(Object.keys(roadGraph)); // Picks delivery addresses for the parcels randomly from roadGraph array.
        let place;
        do {
            place = randomPick(Object.keys(roadGraph)); // Randomly determines starting location of the parcel.
        } while (place == address); // Continue to change the starting location for as long as place === address, so as to avoid parcels that need to be "delivered" to their own start location.
        parcels.push({place, address}); // After the loop above has finished, push that parcel's info to the "parcels" array.
    } return new VillageState("Post Office", parcels); // After the overall loop (determined by parcelCount argument) has finished, return state that starts the robot at the Post Office and provides created parcels array.
};

runRobot(VillageState.random(), randomRobot); // Runs random robot, and creates a random state for the packages.

const mailRoute = [ // Creates a pre-determined mail route for robot, which passes through all locations.
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House", 
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state, memory){ 
    if (memory.length == 0){ // If the route has been completed (i.e. memory array.length is 0), restart the route.
        memory = mailRoute; // This would need to be on a loop if we expected to continue picking up packages as the "day" went on, but as-is the robot will never have to make more than two runs of the route to deliver everything.
    }
    return {direction: memory[0], memory: memory.slice(1)}; // The new direction for the robot will be the next location (i.e. the first element in the remaining Memory array), and the new memory array will leave off that first element.
	
}

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
    } return {direction: route[0], memory: route.slice(1)}; // After that, begin moving in the direction of either of those two destinations, and remove that first move from the beginning of the route.
}

runRobot(VillageState.random(), goalOrientedRobot, []);
runRobot(VillageState.random(), routeRobot, []);