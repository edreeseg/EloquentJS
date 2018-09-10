import {bigOak} from "./crow-tech"; // Abstract example - we are retrieving "food caches" from the "bigOak" storage bulb.

bigOak.readStorage("food caches", caches => {
	let firstCache = caches[0];
	bigOak.readStorage(firstCache, info => {
		console.log(info);
	});
});

// Eloquent JS notes that the style above is workable, but the indentation can get out of hand when you're making several actions, and end up 
// being awkward.

// The interface exported by the "./crow-tech" module provides functions for network communication.  The .send method expects three arguments,
// a target storage bulb, a request type, the content of the request, and a function to be executed when a response comes in.

bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM", () => console.log("Note delivered."));

// However, to make nests capable of receiving the transmission, a request type named "note" first needs to be defined:

import {defineRequestType} from "./crow-tech";

defineRequestType("note", (nest, content, source, done) => {
	console.log(`${nest.name} received note: ${content}`);
	done();
});

// Defines "note" request, arguments include the target nest, content being sent, source of said content, as well as a "done" function to be performed
// when handler is done with the request.  We can't use the handler's return value as the response, becuase typically, a request handler 
// returns before the work is actually done, having arranged for a callback to be called when it completes.  So basically, the handler will return
// first, and then "done()" will be called after the handling has been finished.  This is what makes it asynchronous.

// Asynchronicity is contagious, in a way.  Any function that calls a function that works asynchronously must itself be asynchronous.

// A promise is a standard class.  It's an asynchronous value that may complete at some point and produce a value. It can then notify any interested 
// parts of the code that it is complete, and of this value.

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`);

// The above code uses the reolve method on the Promise class.

// Below is how you'd create a promise-bsaed interface for the readStorage function.

function storage(nest, name){
	return new Promise(resolve => {
		nest.readStorage(name, result => resolve(result));
	});
}

storage(bigOak, "enemies") // Calling function
	.then (value => console.log("Got", value));
	
//

new Promise((_, reject) => reject(new Error("Fail")))
	.then(value => console.log("Handler 1"))
	.catch(reason => {
		console.log("Caught failure " + reason);
		return "nothing";
	})
	.then(value => console.log("Handler 2", value));
// -> Caught failure Error: Fail
// -> Handler 2 nothing



class Timeout extends Error {}

function request(nest, target, type, content){
	return new Promise((resolve, reject) => {
		let done = false;
		function attempt(n){
			nest.send(target, type, content, (failed, value) => {
				done = true;
				if(failed) reject(failed);
				else resolve(value);
			});
			setTimeout(() => {
				if(done) return;
				else if (n < 3) attempt(n + 1);
				else reject(new Timeout('Timed out'));
			}, 250);
		}
		attempt(1);
	});
}
// Tries to send every quarter-second, and returns Timeout error if it fails thrice.



function requestType(name, handler){
	defineRequestType(name, (nest, content, source, callback) => {
		try {
			Promise.resolve(handler, (nest, content, source))
				.then(response => callback(null, response),
				failure => callback(failure));
		} catch(exception){
			callback(exception);
		}
	});
}
// ^^Wrapper for defineRequestType.  Allows handler to return a promise or plain value and wires that up to the callback.^^

requestType('ping', () => 'pong');

function availableNeighbors(nest){
	let requests = nest.neighbors.map(neighbor => {
		return request(nest, neighbor, 'ping')
			.then(() => true, () => false);
	});
	return Promise.all(requests).then(result => {
		return nest.neighbors.filter((_, i) => result[i]);
	});
}








	