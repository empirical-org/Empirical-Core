EC.modules.StudentProfileTooltipTitleGenerator = function (percentageDisplayer) {

  var _displayPercentage = percentageDisplayer.run

  this.generate = function (data) {
    var totalScoreOrNot;
    if (data.percentage == null) {
      totalScoreOrNot = null
    } else {
      totalScoreOrNot = <EC.TotalScore percentage={_displayPercentage(data.percentage)} />
    }

    return React.renderToString(
      <div className='student-profile-tooltip'>
        <div className='title'>
          ACTIVITY RESULTS
        </div>
        <div className='main'>
          {totalScoreOrNot}
          <EC.ActivityDetails data={data} />
        </div>
      </div>
    );
  }
}