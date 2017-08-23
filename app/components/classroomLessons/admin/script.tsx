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
      <div style={styles.box} key={scriptItem}>
        {item.type} {item.data ? item.data.heading : ''}
        <a href={`/#/admin/classroom-lessons/${this.props.lesson}/slide/${this.props.slide}/scriptItem/${scriptItem}`}> edit</a>
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
