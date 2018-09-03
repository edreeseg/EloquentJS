// RegExp Golf

let answer;
// car and cat:
    answer = /ca[rt]/;
// pop and prop:
    answer = /pr?op/;
// ferret, ferry, and ferrari
    answer = /ferr(et|y|ari)/;
// Any word ending in "ious":
    answer = /\w+ious/;
// A whitespace character followed by a period, comma, colon, or semicolon:
    answer = /\w[.,:;]/;
// A word longer than six letters:
    answer = /\w{6,}/;
// A word without the letter e (or E):
    answer = /\b[^e\W\d]+\b/i;

//Quoting Style

const replaceQuotes = (str) => {
    str.replace(/(\W|^)'|'(\W|$)/g, '$1"$2');
}

// Numbers Again

let number = /^[-+]?(\d+(e[+-]?)?\.?\d*(e[+-]?)?\d*|\d*(e[+-]?)?\.?\d*(e[+-]?)?\d+)$/i;
// Dear lord, please no.  Actually good answer below:

number = /^[+\-]?(\d+(\.\d*)?|\.\d+)([eE][+\-]?\d+)?$/;
//PRACTICE REGEXP