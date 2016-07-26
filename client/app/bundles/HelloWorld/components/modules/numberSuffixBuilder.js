'use strict';

export default  function () {
	function numberGrade(num){
		var numS = String(num),numL = numS.length-1,numberSuffix;
		if (num >=11 && num <= 19){
			numberSuffix = "th"
		}
		else if (numS[numL] === "1"){
			numberSuffix = "st"
		}
		else if (numS[numL] === "2"){
			numberSuffix = "nd"
		}
		else if (numS[numL] === "3"){
			numberSuffix = "rd"
		}
		else{
			numberSuffix = "th"
		}
		return num+numberSuffix;

	}
}