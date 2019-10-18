import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'underscore';
import * as questionActions from '../../actions/questions';
import SortableList from '../shared/sortableList'
import {
  hashToCollection,
} from '../../helpers/hashToCollection';

export class FocusPointsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.deleteFocusPoint = this.deleteFocusPoint.bind(this);
    this.sortCallback = this.sortCallback.bind(this);
    this.updatefpOrder = this.updatefpOrder.bind(this);

    this.state = { fpOrderedIds: null };
  }

  getQuestion() {
    return this.props.questions.data[this.props.match.params.questionID];
  }

  getFocusPoints() {
    return this.getQuestion().focusPoints;
  }

  deleteFocusPoint(focusPointID) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteFocusPoint(this.props.match.params.questionID, focusPointID));
    }
  }

  deleteConceptResult(conceptResultKey, focusPointKey) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getFocusPoints()[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.match.params.questionID, data, focusPointKey));
    }
  }

  renderTagsForFocusPoint(focusPointString) {
    return focusPointString.split('|||').map((fp, index) => (<span key={`fp${index}`} className="tag is-medium is-light" style={{ margin: '3px', }}>{fp}</span>));
  }

  renderConceptResults(concepts, focusPointKey) {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p key={`${val.name}`} className="control sub-title is-6">{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
          : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <span className="tag is-small is-warning" style={{ cursor: 'pointer', marginLeft: 5, }} onClick={() => this.deleteConceptResult(key, focusPointKey)}>Delete</span>
        </p>
        )
      );
      return _.values(components);
    }
  }
  //
  fPsortedByOrder() {
    if (this.state.fpOrderedIds) {
      const focusPoints = hashToCollection(this.getFocusPoints())
      return this.state.fpOrderedIds.map(id => focusPoints.find(fp => fp.key === id))
    } else {
      return hashToCollection(this.getFocusPoints()).sort((a, b) => a.order - b.order);
    }
  }

  renderFocusPointsList() {
    const components = this.fPsortedByOrder().map((fp) => {
      if (fp.text) {
        return (
          <div key={fp.key} className="card is-fullwidth has-bottom-margin">
            <header className="card-header">
              <p className="card-header-title" style={{ display: 'inline-block', }}>
                {this.renderTagsForFocusPoint(fp.text)}
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
              <a href={`/#/admin/questions/${this.props.match.params.questionID}/focus-points/${fp.key}/edit`} className="card-footer-item">Edit</a>
              <a onClick={() => this.deleteFocusPoint(fp.key)} className="card-footer-item">Delete</a>
            </footer>
          </div>
        );
      }
    });
    return <SortableList key={_.values(components).length} sortCallback={this.sortCallback} data={_.values(components)} />;
  }

  sortCallback(sortInfo) {
    const fpOrderedIds = sortInfo.data.items.map(item => item.key);
    this.setState({ fpOrderedIds, });
  }

  updatefpOrder() {
    if (this.state.fpOrderedIds) {
      const focusPoints = this.getFocusPoints();
      const newFp = {};
      this.state.fpOrderedIds.forEach((id, index) => {
        const fp = Object.assign({}, focusPoints[id]);
        fp.order = index + 1;
        newFp[id] = fp;
      });
      this.props.dispatch(questionActions.submitBatchEditedFocusPoint(this.props.match.params.questionID, newFp));
      alert('saved!');
    } else {
      alert('no changes to focus points have been made');
    }
  }

  renderfPButton() {
    return (
      this.state.fpOrderedIds ? <button className="button is-outlined is-primary" style={{ float: 'right', }} onClick={this.updatefpOrder}>Save FP Order</button> : null
    );
  }

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Focus Points</h1>
          <a className="button is-outlined is-primary" style={{ float: 'right', }} href={`/#/admin/questions/${this.props.match.params.questionID}/focus-points/new`}>Add Focus Point</a>
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
