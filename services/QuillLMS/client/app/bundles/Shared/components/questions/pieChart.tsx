import * as React from 'react'
const Pie = require('react-simple-pie-chart')

class PieChart extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      expandedSector: null
    }

    this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)
    this.handleMouseLeaveFromSector = this.handleMouseLeaveFromSector.bind(this)
  }

  handleMouseEnterOnSector(sector: any) {
    this.setState({ expandedSector: sector })
  }

  handleMouseLeaveFromSector() {
    this.setState({ expandedSector: null })
  }

  render() {
    return (
      <div id='pie-chart'>
        <Pie
          slices={this.props.data}
        />
        {
          this.props.data.map((d: any, i: number) => (
            <div key={i}>
              <span style={{ backgroundColor: d.color, width: '20px', marginRight: 5, color: d.color, borderRadius: '100%' }}>OO</span>
              <span style={{ fontWeight: this.state.expandedSector == i ? 'bold' : null }}>
                { d.label }: { d.value }
              </span>
            </div>
          ))
        }
        {
          this.props.total ?
            <div>
              <span style={{marginRight: '28px'}} />
              <span>Total: {this.props.total}</span>
            </div>
            : ''
        }
        <a href="https://github.com/empirical-org/Quill-Connect/blob/master/app/libs/README.md">How our marking works</a>
      </div>
    )
  }
}

export { PieChart }
