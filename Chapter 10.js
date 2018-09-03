// A Modular Robot

// Roads Module

// Circular Dependencies

require.cache = Object.create(null);

function require(name){
	if (!(name in require.cache)){
		let code = readFiles(name);
		let module = {exports: {}};
		require.cache[name] = module;
		let wrapper = Function("require, exports, module", code);
		wrapper(require, module.exports, module);
	}
	return require.cache[name].exports;
	}
}

// The function require handles cycles by calling itself recursively on the exports object, so as to ensure that the function does not finish loading the module
// until after it has ensured any dependencies have been accounted for.  If the exports object is changed, this throws off the entire operation,
// as you can no longer guarantee the dependencies that needed to be accounted for are going to be accounted for.