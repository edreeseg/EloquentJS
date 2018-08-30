// A Vector Type

class Vec{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	plus(newVec){
		return new Vec(this.x + newVec.x, this.y + newVec.y);
	}
	minus(newVec){
		return new Vec(this.x - newVec.x, this.y - newVec.y);
	}
	get length(){
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
}

// Groups

class Group{
	constructor(){
		this.group = [];
	}
	add(value){
		this.group.indexOf(value) === -1 ? this.group.push(value) : console.log("This value exists within this group.");
	}
	delete(value){
		this.group.indexOf(value) !== -1 ? this.group.splice(this.group.indexOf(value), 1) : console.log("This value does not exist within this group.");
	}
	has(value){
		return this.group.indexOf(value) != -1 ? true : false;
	}
	static from(obj){
		let tempGroup = new Group;
		for (let value of obj)
			tempGroup.add(value);
		return tempGroup;
	}
	[Symbol.iterator](){
  	return new GroupIterator(this);
  }
}

// Iterable Groups

class GroupIterator{
	constructor(group){
		this.i = 0;
		this.group = group;
	}
	next(){
		if (this.i === this.group.group.length)
			return {done: true};
		let result = {value: this.group.group[this.i], done: false};
		this.i++;
		return result;
	}
}	


// Borrowing a Method

let map = {one: true, two: true, hasOwnProperty: true};
console.log(Object.prototype.hasOwnProperty.call(map, "one"));


















