// Minimum

const mathMin = function (x, y){
	if (arguments.length === 0)
		return Infinity;
	else if (typeof x !== "number" || typeof y !== "number")
		return NaN;
	else
		return x <= y ? x : y;
	}
	
// Recursion

const isEven = (n) => {
	if (n === 0) return "Even";
	else if (n === 1 || n === -1) return "Odd";
	else return n > 0 ? isEven(n - 2) : isEven(n + 2);
}

// Bean Counting

const countBs = (str) => str.match(/B/g) ? str.match(/B/g).length : 0;

const countChar = (str, char) => str.match(RegExp(char, "g")) ? 
	str.match(RegExp(char, "g")).length 
	: 0;

const countBs = (str) => countChar(str, "B");