import * as React from 'react'
import { requestGet } from '../../../modules/request';
import PreAp from '../components/college_board/pre_ap'

interface PreApContainerProps {
  isPartOfAssignmentFlow?: boolean;
  units?: Array<any>
}

interface PreApContainerState {
  units: Array<any>
}

export default class PreApContainer extends React.Component<PreApContainerProps, PreApContainerState> {
  constructor(props: PreApContainerProps) {
    super(props)

    this.state = { units: props.units, }
  }

  componentDidMount() {
    const { units, } = this.state

    if (!units) {
      requestGet('/preap_units.json',
       (data) => {
         this.setState({ units: data.units, })
       }
     )
    }
  }

  render() {
    const { units, } = this.state
    const { isPartOfAssignmentFlow, } = this.props

    return <PreAp isPartOfAssignmentFlow={isPartOfAssignmentFlow} units={units} />
  }
}
