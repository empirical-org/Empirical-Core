EC.modules.TooltipTitleGeneratorGenerator = function (context) {
  if (context == undefined) {
    throw "Error: required parameter in EC.modules.TooltipTitleGeneratorGenerator is undefined"
  }

  var _percentageDisplayer = new EC.modules.PercentageDisplayer()
  var _studentProfileTooltipTitleGenerator = EC.modules.StudentProfileTooltipTitleGenerator;
  var _scorebookTooltipTitleGenerator = EC.modules.ScorebookTooltipTitleGenerator;

  this.generate = function () {
    var result, finalResult;

    if (context == 'studentProfile') {
      result = _studentProfileTooltipTitleGenerator;
    } else if (context == 'scorebook') {
      result = _scorebookTooltipTitleGenerator;
    }
    console.log('result', result)
    finalResult = new result(_percentageDisplayer);
    return finalResult;
  }
}