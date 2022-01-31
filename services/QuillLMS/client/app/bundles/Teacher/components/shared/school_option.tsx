import * as React from 'react'

interface SchoolOptionProps {
  selectSchool: Function;
  school: any;
  text: string;
  secondaryText: string;
  numberOfTeachersText: string;
}

export default class SchoolOption extends React.Component<SchoolOptionProps, {}> {
  handleSchoolOptionClick = () => {
    const { selectSchool, school, } = this.props
    selectSchool(school.id, school)
  }

  render() {
    const { text, secondaryText, numberOfTeachersText, } = this.props
    return (
      <li onClick={this.handleSchoolOptionClick}>
        <span className="text">
          <span className="primary-text">{text}</span>
          <span className="secondary-text">{secondaryText}</span>
        </span>
        <span className="metadata">{numberOfTeachersText}</span>
      </li>
    )
  }
}
