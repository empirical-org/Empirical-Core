import * as React from 'react';
import { Link } from 'react-router-dom';
// interface QuestionListProps {
//   showOnlyArchived: boolean;
//   questions: Array<any>;
//   basePath: string;
// }
//
export class QuestionList extends React.Component<any, {}> {
  constructor(props: any) {
    super(props)

    this.renderListItems = this.renderListItems.bind(this)
  }

  renderListItems() {
    const { basePath } = this.props;
    const questions = this.props.questions;
    if (questions.length !== 0) {
      let filtered;
      if (!this.props.showOnlyArchived) {
        filtered = questions.filter((question: any) =>
          question.flag !== "archived"
        )
      } else {
        filtered = questions.filter((question: any) =>
          question.flag === "archived"
        )
      }
      return filtered.map((question: any) => (
        <Link to={'/admin/' + basePath + '/' + question.key + '/responses'}>
          <span dangerouslySetInnerHTML={{ __html: question.prompt ? question.prompt : question.title }} />
        </Link>
      ));
    }
  }

  render() {
    return (
      <ul className="menu-list">
        {this.renderListItems()}
      </ul>
    );
  }
}
