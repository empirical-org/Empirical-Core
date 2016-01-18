EC.modules.ScorebookTooltipTitleGenerator = function (percentageDisplayer) {

  var _displayPercentage = percentageDisplayer.run

  this.generate = function (data) {
    var result;
    result = (
      <div className='scorebook-tooltip'>
        <div className='title'>
          ACTIVITY RESULTS
        </div>
        <div className='main'>
          <EC.ConceptResultStats results={data.concept_results} />
          <EC.ActivityDetails data={data} />
        </div>
        <EC.AboutPremium />
      </div>
    );
    return React.renderToString(result)
  }
}