import * as React from 'react';
import { LinkListItem } from './linkListItem';

export class QuestionList extends React.Component<any, {}> {

  renderListItems = () => {
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
        <LinkListItem
          basePath={this.props.basePath}
          itemKey={question.key}
          key={question.key}
          text={question.prompt ? question.prompt : question.title}
        />
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
