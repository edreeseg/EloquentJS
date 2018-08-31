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

const roadGraph = buildGraph(roads);

class VillageState{ // Creates a new state indicating where robot currently is, and where parcels are located.
    constructor(place, parcels){
        this.place = place;
        this.parcels = parcels;
    }
    move(destination){
        if(!roadGraph[this.place].includes(destination))
            return this;
        else {
            let parcels = this.parcels.map(p => { // Handles movement of robot.
                if (p.place != this.place) return p;
                return {place: destination, address: p.address};
            }).filter(p => p.place != p.address); // Handles delivering of packages.
            return new VillageState(destination, parcels);
        }
    }
}