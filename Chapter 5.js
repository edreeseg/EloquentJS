// Flattening

const flatten = arr => arr.reduce((a, b) => a.concat(b));

// Your Own Loop

const loop = (value, test, update, body) => {
	if (test(value)){
		body(value);
		loop(update(value), test, update, body);
	} else return;
}

// Everything

const every = (arr, f) => {
	for (let i = 0; i < arr.length; i++)
		if (!f(arr[i])) return false;
	return true;
} 

const every = (arr, f) => arr.some(x => !f(x));

// Dominant Writing Direction

const dominantDirection = (text) => {  // There should be a way to do this that looks more coherent.
	let result;
	let current;
	const count = {};
	for (let i = 0; i < text.length; i++) { 
		if (characterScript(text.codePointAt(i))) {
			const direction = characterScript(text.codePointAt(i)).direction;
			count.hasOwnProperty(direction) ? count[direction]++ : count[direction] = 1;
		}
	}	for (let direction in count){ 
	if (count[direction] > current || result === undefined) 
		result = direction;
		current = count[direction]
	}
	
	return result;
}