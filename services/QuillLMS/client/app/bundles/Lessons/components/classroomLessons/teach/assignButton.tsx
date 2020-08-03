import * as React from 'react';


class AssignButton extends React.Component<{selectedOptionKey: string, assignAction: Function}>{
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <div className='assign-button-container'>
        <button onClick={()=>this.props.assignAction(this.props.selectedOptionKey)}>
          {this.props.selectedOptionKey}
        </button>
      </div>
    )

  }


}

export default AssignButton
