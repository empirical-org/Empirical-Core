EC.modules.ScorebookTooltipTitleGenerator = function (percentageDisplayer) {

  var _displayPercentage = percentageDisplayer.run

  this.generate = function (data) {
    var result, totalScoreOrNot, aboutPremiumOrNot;

    if (data.percentage == null) {
      totalScoreOrNot = null
    } else {
      totalScoreOrNot = <EC.TotalScore percentage={_displayPercentage(data.percentage)} />
    }

    if (data.premium_state == 'premium') {
      aboutPremiumOrNot = null;
    } else {
      aboutPremiumOrNot = <EC.AboutPremium />;
    }



    result = (
      <div className='scorebook-tooltip'>
        <div className='title'>
          ACTIVITY RESULTS
        </div>
        <div className='main'>
          <EC.ConceptResultStats results={data.concept_results} />
          {totalScoreOrNot}
          <EC.ActivityDetails data={data} />
        </div>
        {aboutPremiumOrNot}
      </div>
    );
    return React.renderToString(result)
  }
}