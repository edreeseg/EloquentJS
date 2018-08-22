// Looping a Triangle

for (let i = 1; i < 8; i++)
	console.log("#".repeat(i));
// or for IE
for (let i = 2; i < 9; i++)
	console.log(Array(i).join("#"));

// FizzBuzz

for (let i = 1; i < 101; i++)
	console.log((i % 3 ? "" : "Fizz")+(i % 5 ? "" : "Buzz") || i); // Basic for loop may be faster on average.

// Chessboard

const chessboard = (size) => {
	for (let i = 0; i < size; i++)
		console.log(i % 2 ? "# ".repeat(size / 2) + (size % 2 ? "#": "") : " #".repeat(size / 2) + (size % 2 ? " " : ""));
}