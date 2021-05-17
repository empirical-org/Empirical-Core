import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'underscore';

import * as questionActions from '../../actions/questions';
import { hashToCollection, SortableList,  } from '../../../Shared/index'

export class FocusPointsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.deleteFocusPoint = this.deleteFocusPoint.bind(this);
    this.sortCallback = this.sortCallback.bind(this);
    this.updatefpOrder = this.updatefpOrder.bind(this);

    const question = this.props.questions.data[this.props.match.params.questionID]
    const focusPoints = this.getFocusPoints(question)

    this.state = { fpOrderedIds: null, focusPoints: focusPoints };
  }

  getFocusPoints(question) {
    return question.focusPoints;
  }

  deleteFocusPoint(focusPointID) {
    const { focusPoints } = this.state
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteFocusPoint(this.props.match.params.questionID, focusPointID));
      delete focusPoints[focusPointID]
      this.setState({focusPoints: focusPoints})
    }
  }

  deleteConceptResult(conceptResultKey, focusPointKey) {
    const { focusPoints } = this.state
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = focusPoints[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.match.params.questionID, data, focusPointKey));
    }
  }

  renderConceptResults(concepts, focusPointKey) {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p className="control sub-title is-6" key={`${val.name}`}>{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
          : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <span className="tag is-small is-warning" onClick={() => this.deleteConceptResult(key, focusPointKey)} style={{ cursor: 'pointer', marginLeft: 5, }}>Delete</span>
        </p>
        )
      );
      return _.values(components);
    }
  }
  //
  fPsortedByOrder() {
    const { focusPoints } = this.state
    if (this.state.fpOrderedIds) {
      const focusPointsCollection = hashToCollection(focusPoints)
      return this.state.fpOrderedIds.map(id => focusPointsCollection.find(fp => fp.key === id))
    } else {
      return hashToCollection(focusPoints).sort((a, b) => a.order - b.order);
    }
  }

  saveFocusPoint = (key) => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { focusPoints } = this.state
    let data = focusPoints[key]
    delete data.conceptResults.null;
    dispatch(questionActions.submitEditedFocusPoint(questionID, data, key));
  };

  renderFocusPointsList() {
    const components = this.fPsortedByOrder().map((fp) => {
      if (fp.text) {
        return (
          <div className="card is-fullwidth has-bottom-margin" key={fp.key}>
            <header className="card-header">
              <p className="card-header-title" style={{ display: 'inline-block', }}>
                {this.renderTextInputFields(fp.text, fp.key)}
              </p>
              <p className="card-header-icon">
                {fp.order}
              </p>
            </header>
            <div className="card-content">
              <p className="control" dangerouslySetInnerHTML={{ __html: '<strong>Feedback</strong>: ' + fp.feedback + '<br/>' }} />
              {this.renderConceptResults(fp.conceptResults, fp.key)}
            </div>
            <footer className="card-footer">
              <a className="card-footer-item" href={`/grammar/#/admin/questions/${this.props.match.params.questionID}/focus-points/${fp.key}/edit`}>Edit</a>
              <a className="card-footer-item" onClick={() => this.deleteFocusPoint(fp.key)}>Delete</a>
            </footer>
          </div>
        );
      }
    });
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  handleChange = (e, key) => {
    const { focusPoints } = this.state
    let value = e.target.value;
    let className = `regex-${key}`
    value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}`;
    focusPoints[key].text = value;
    this.setState({focusPoints: focusPoints})
  }

  renderTextInputFields = (sequenceString, key) => {
    let className = `input regex-inline-edit regex-${key}`
    return sequenceString.split(/\|{3}(?!\|)/).map(text => (
      <input className={className} onBlur={(e) => this.saveFocusPoint(key)} onChange={(e) => this.handleChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
    ));
  }

  sortCallback(sortInfo) {
    const fpOrderedIds = sortInfo.map(item => item.key);
    this.setState({ fpOrderedIds, });
  }

  updatefpOrder() {
    const { focusPoints } = this.state
    if (this.state.fpOrderedIds) {
      const focusPoints = focusPoints;
      const newFp = {};
      this.state.fpOrderedIds.forEach((id, index) => {
        const fp = Object.assign({}, focusPoints[id]);
        fp.order = index + 1;
        newFp[id] = fp;
      });
      this.props.dispatch(questionActions.submitBatchEditedFocusPoint(this.props.match.params.questionID, newFp));
      this.setState({ focusPoints: newFp})
      alert('saved!');
    } else {
      alert('no changes to focus points have been made');
    }
  }

  renderfPButton() {
    return (
      this.state.fpOrderedIds ? <button className="button is-outlined is-primary" onClick={this.updatefpOrder} style={{ float: 'right', }}>Save FP Order</button> : null
    );
  }

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Focus Points</h1>
          <a className="button is-outlined is-primary" href={`/grammar/#/admin/questions/${this.props.match.params.questionID}/focus-points/new`} rel="noopener noreferrer" style={{ float: 'right', }} target="_blank">Add Focus Point</a>
          {this.renderfPButton()}
        </div>
        {this.renderFocusPointsList()}
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions
  };
}

export default connect(select)(FocusPointsContainer);
