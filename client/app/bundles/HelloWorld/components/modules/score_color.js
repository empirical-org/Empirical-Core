'use strict';
// generally used for setting color class names, hence the score color concat at end
export default function(grade) {
	let color;
	if (grade >= 76) {
		color = 'green';
	} else if (grade >= 50 && grade <= 75) {
		color = 'yellow';
	} else if (grade <= 49) {
		color = 'red';
	} else {
		color = null;
	};
	return color + '-score-color';
};
