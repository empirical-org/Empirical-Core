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