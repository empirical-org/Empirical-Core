import React from 'react';
import request from 'request';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      subtitle: null,
      body: null,
      authorId: null,
      topic: null,
      authors: this.props.authors,
      selectedAuthorId: null,
    };
    this.handleTitleChange =  this.handleTitleChange.bind(this)
  }

  handleTitleChange(e){
    this.setState({title: e.target.value})
  }

  handleSubtitleChange(e){
    this.setState({subtitle: e.target.value})
  }


  render() {
    debugger;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input type="text" value={this.state.title} onChange={this.handleTitleChange}/>
        </label>
        <br/>
        <label>
          Subtitle:
          <input type="text" value={this.state.subtitle} onChange={this.handleSubtitleChange}/>
        </label>
        <br/>
        <label>
          Author:
          <ItemDropdown
            items= {this.props.authors}
            callback={this.switchAuthor}
            selectedItem={this.state.selectedAuthor}/>
        </label>
        <br/>

        <input type="submit" value="Submit"/>
      </form>
    )
  }
}
