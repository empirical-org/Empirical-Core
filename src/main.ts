interface Dictionary {
    [word: string]: number;
}

export function train(text: string): Dictionary {
    const dictionary: Dictionary = {};
    var word, m
    const r = /[a-z]+/g;
	text = text.toLowerCase();
	while (m = r.exec(text)) {
		word = m[0];
        dictionary[word] = dictionary.hasOwnProperty(word) ? dictionary[word] + 1 : 1;
    }
    return dictionary;
}

export function correct(dictionary: Dictionary, potentialWord: string) {
    if (dictionary.nWords.hasOwnProperty(potentialWord)) {
        return potentialWord
    }
    const candidates = {}
    const list = edits(potentialWord)
}

export function edits(word): string[] {
    var i, results: string[] = [];
	// deletion
	for (i=0; i < word.length; i++)
	    results.push(word.slice(0, i) + word.slice(i+1));
	// transposition
	for (i=0; i < word.length-1; i++)
	    results.push(word.slice(0, i) + word.slice(i+1, i+2) + word.slice(i, i+1) + word.slice(i+2));
	// alteration
	for (i=0; i < word.length; i++)
	    letters.forEach(function (l) {
	        results.push(word.slice(0, i) + l + word.slice(i+1));
		});
	// insertion
	for (i=0; i <= word.length; i++)
	    letters.forEach(function (l) {
	        results.push(word.slice(0, i) + l + word.slice(i));
		});
	return results;
}

const letters: string[] = "abcdefghijklmnopqrstuvwxyz".split("");