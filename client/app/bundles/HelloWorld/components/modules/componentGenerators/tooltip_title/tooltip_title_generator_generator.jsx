import PercentageDisplayer  from '../../percentage_displayer.jsx'
import StudentProfileTooltipTitleGenerator from './student_profile_tooltip_title_generator.jsx'
import ScorebookTooltipTitleGenerator from './scorebook_tooltip_title_generator.jsx'


export default function (context) {
  if (context == undefined) {
    throw "Error: required parameter in EC.modules.TooltipTitleGeneratorGenerator is undefined"
  }

  var _percentageDisplayer = new PercentageDisplayer()
  var _studentProfileTooltipTitleGenerator = StudentProfileTooltipTitleGenerator;
  var _scorebookTooltipTitleGenerator = ScorebookTooltipTitleGenerator;

  this.generate = function () {
    var result, finalResult;

    if (context == 'studentProfile') {
      result = _studentProfileTooltipTitleGenerator;
    } else if (context == 'scorebook') {
      result = _scorebookTooltipTitleGenerator;
    }
    finalResult = new result(_percentageDisplayer);
    return finalResult;
  }
}
