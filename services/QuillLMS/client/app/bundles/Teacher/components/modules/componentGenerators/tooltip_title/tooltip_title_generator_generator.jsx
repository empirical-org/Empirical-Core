import PercentageDisplayer from '../../percentage_displayer.jsx';
import ScorebookTooltipTitleGenerator from './scorebook_tooltip_title_generator.jsx';
import StudentProfileTooltipTitleGenerator from './student_profile_tooltip_title_generator.jsx';

export default function (context) {
  if (context == undefined) {
    throw 'Error: required parameter in TooltipTitleGeneratorGenerator is undefined';
  }

  const _percentageDisplayer = new PercentageDisplayer();
  const _studentProfileTooltipTitleGenerator = StudentProfileTooltipTitleGenerator;
  const _scorebookTooltipTitleGenerator = ScorebookTooltipTitleGenerator;

  this.generate = function () {
    let result,
      finalResult;

    if (context == 'studentProfile') {
      result = _studentProfileTooltipTitleGenerator;
    } else if (context == 'scorebook') {
      result = _scorebookTooltipTitleGenerator;
    }
    finalResult = new result(_percentageDisplayer);
    return finalResult;
  };
}
