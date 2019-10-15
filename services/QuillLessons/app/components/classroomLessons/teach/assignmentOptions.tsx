declare function require(name:string): any
import * as React from 'react'
const RadioButtonHover = 'https://assets.quill.org/images/icons/radioButtonHover.svg'
const RadioButtonIcon = 'https://assets.quill.org/images/icons/radioButtonIcon.svg'
const RadioButtonSelected = 'https://assets.quill.org/images/icons/radioButtonSelected.svg'

class AssignmentOptions extends React.Component<{numberOfStudents: number, updateSelectedOptionKey: Function, selectedOptionKey: string, followUpActivityName: string}> {
  constructor(props) {
    super(props)
  }

  optionObj() {
    const {numberOfStudents} = this.props
    return (
      {
        "Small Group Instruction and Independent Practice": "Unflagged students will start the independent practice now. You can pull the flagged students aside for small group instruction.",
        "All Students Practice Now": `All ${numberOfStudents} students in the class will enter the activity now.`,
        "All Students Practice Later": `All ${numberOfStudents} students will be assigned the activity, and they will see it on their profile.`,
        "No Follow Up Practice": "Students receive no follow up activity."
      }
    )
  }

  renderOptions() {
    const optionObject = this.optionObj()
    const optionsList: Array<JSX.Element> = [];
    for (let option in optionObject) {
      const isSelected = option === this.props.selectedOptionKey
      const imgSrc = isSelected ? RadioButtonSelected : RadioButtonIcon;
      const row = (
        <div className='assign-option-row' key={option} onClick={() => this.props.updateSelectedOptionKey(option)}>
          <div className='flex-container'>
            <h3>{option}</h3>
            <p>
              {optionObject[option]}
              <span>
                <input
                  checked={isSelected}
                  id={option}
                  name='rad-button'
                  style={{display: 'none'}}
                  type="radio"
                  value={option}
                />
              </span>
            </p>
          </div>
          <label htmlFor={option}>
            <div className='img-container'>
              <img alt="checkbox" src={imgSrc} />
            </div>
          </label>
        </div>
      )
      optionsList.push(row)
    }
    return optionsList
  }


  render() {
    return (
      <div className="assignment-options-container">
        <div className="assignment-options-header">
          <h2>{this.props.followUpActivityName}</h2>
        </div>
        {this.renderOptions()}
      </div>
    )
  }

}

export default AssignmentOptions
