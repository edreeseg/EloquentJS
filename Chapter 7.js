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

class VillageState{ // Creates a new state indicating where robot currently is, and where parcels are located.
    constructor(place, parcels){
        this.place = place;
        this.parcels = parcels;
    }
    move(destination){ // This is a method that handles the actual delivery process of the robot.
        if(!roadGraph[this.place].includes(destination)) // If robot cannot get to its destination from where it currently is, return current state.
            return this;
        else {
            let parcels = this.parcels.map(p => { // Handles movement of robot.   <------------|
                if (p.place != this.place) return p; //                                        |__ Need
                return {place: destination, address: p.address}; //                            |   Elaboration
            }).filter(p => p.place != p.address); // Handles delivering of packages. <---------|
            return new VillageState(destination, parcels);
        }
    }
}

let first = new VillageState( // New state in which robot is initialized at the Post office, and must deliver parcels to Alice's House.
    "Post Office",
    [{place: "Post Office", address:"Alice's House"}]
);
let next = first.move("Alice's House");

function runRobot(state, robot, memory) {
    for (let turn = 0; ; turn++){
        if (state.parcels.length == 0){
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array){
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state){
    return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount = 5){
    let parcels = [];
    for (let i = 0; i < parcelCount; i++){
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({place, address});
    } return new VillageState("Post Office", parcels);
};

runRobot(VillageState.random(), randomRobot);

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House", 
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state, memory){
    if (memory.length == 0){
        meory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

function findRoute(graph, from, to){
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++){
        let {at, route} = work[i];
        for (let place of graph[at]){
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)){
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

function goalOrientedRobot({place, parcels}, route){
    if (route.length == 0){
        let parcel = parcels[0];
        if (parcel.place != place){
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    } return {direction: route[0], memory: route.slice(1)};
}