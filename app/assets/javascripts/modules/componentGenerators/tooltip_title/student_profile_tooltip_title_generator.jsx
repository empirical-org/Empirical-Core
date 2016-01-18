EC.modules.StudentProfileTooltipTitleGenerator = function (percentageDisplayer) {

  var _displayPercentage = percentageDisplayer.run

  this.generate = function (data) {
    var topicCategoryName;
    if (data.activity.topic.topic_category) {
      topicCategoryName = data.activity.topic.topic_category.name;
    }

    var conceptResultsOrNot, sectionOrNot;

    return React.renderToString(
      <div>
        <h1>{data.activity.name}</h1>
        <p>{data.activity.classification.alias}</p>
        <p>{data.activity.topic.name}</p>
        <p>{data.activity.description}</p>
        <p>{topicCategoryName}</p>
        <p>{_displayPercentage(data.percentage)}</p>
        <p>{data.due_date_or_completed_at_date}</p>
      </div>
    );
  }
}
