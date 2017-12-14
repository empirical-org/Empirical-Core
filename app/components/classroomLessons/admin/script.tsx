import * as React from 'react'
import SortableList from '../../questions/sortableList/sortableList.jsx';

class Script extends React.Component<any, any> {
  constructor(props){
    super(props);

    this.renderScriptItem = this.renderScriptItem.bind(this)
  }

  renderScriptItem(scriptItem) {
    const item = this.props.script[scriptItem]
    return (
      <div key={scriptItem} className="box slide-box">
        <span className="slide-type">{item.type}</span>
        <span className="slide-title">{item.data ? item.data.heading : ''}</span>
        <span className="slide-edit"><a href={`/#/admin/classroom-lessons/${this.props.lesson}/editions/${this.props.editionID}/slide/${this.props.slide}/scriptItem/${scriptItem}`}>Edit</a></span>
      </div>
    );
  }

  scriptItems(): Array<JSX.Element> {
    return Object.keys(this.props.script).map((scriptItem) => {
      return this.renderScriptItem(scriptItem)
    })
  }

  render() {
    return (
      <div>
        <SortableList data={this.scriptItems()} sortCallback={this.props.updateScriptItemOrder} />
      </div>
    )
  }

}

export default Script

const styles = {
  box: {
    marginBottom: 5,
    padding: 5,
    border: '1px #3d3d3d solid',
    borderRadius: 3
  }
}
