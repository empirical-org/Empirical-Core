import React from 'react'
import questionActions from '../../actions/questions'
import sentenceFragmentActions from '../../actions/sentenceFragments'
import Question from '../../libs/question'
const jsDiff = require('diff');
import Modal from '../modal/modal.jsx'
import ResponseList from './responseList.jsx'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Textarea from 'react-textarea-autosize';
var Markdown = require('react-remarkable');
import TextEditor from './textEditor.jsx';
import feedbackActions from '../../actions/concepts-feedback.js'
import ConceptSelector from 'react-select-search'
import getBoilerplateFeedback from './boilerplateFeedback.jsx'
var C = require("../../constants").default
const feedbackStrings = C.FEEDBACK_STRINGS

export default React.createClass({

  getInitialState: function () {
    let actions;
    if (this.props.mode === "sentenceFragment") {
      actions = sentenceFragmentActions;
    } else {
      actions = questionActions;
    }
    return {
      feedback: this.props.response.feedback || "",
      selectedBoilerplate: "",
      selectedBoilerplateCategory: this.props.response.selectedBoilerplateCategory || "",
      selectedConcept: this.props.response.concept || "",
      actions,
      newConceptResult: {
        conceptUID: "",
        correct:  true
      }
    }
  },

  deleteResponse: function (rid) {
    if (window.confirm("Are you sure?")) {
      this.props.dispatch(this.state.actions.deleteResponse(this.props.questionID, rid))
    }
  },

  editResponse: function (rid) {
    this.props.dispatch(this.state.actions.startResponseEdit(this.props.questionID, rid))
  },

  // cancel editing function ^^^^
  cancelResponseEdit: function (rid) {
    this.props.dispatch(this.state.actions.cancelResponseEdit(this.props.questionID, rid))
  },

  viewChildResponses: function (rid) {
    this.props.dispatch(this.state.actions.startChildResponseView(this.props.questionID, rid))
  },

  cancelChildResponseView: function (rid) {
    this.props.dispatch(this.state.actions.cancelChildResponseView(this.props.questionID, rid))
  },

  viewFromResponses: function (rid) {
    this.props.dispatch(this.state.actions.startFromResponseView(this.props.questionID, rid))
  },

  cancelFromResponseView: function (rid) {
    this.props.dispatch(this.state.actions.cancelFromResponseView(this.props.questionID, rid))
  },

  viewToResponses: function (rid) {
    this.props.dispatch(this.state.actions.startToResponseView(this.props.questionID, rid))
  },

  cancelToResponseView: function (rid) {
    this.props.dispatch(this.state.actions.cancelToResponseView(this.props.questionID, rid))
  },

  updateResponse: function (rid) {
    window.state = this.state.feedback;
    var newResp = {
      weak: false,
      feedback: this.state.feedback,
      optimal: this.refs.newResponseOptimal.checked
    }
    this.props.dispatch(this.state.actions.submitResponseEdit(this.props.questionID, rid, newResp))
  },

  updateRematchedResponse: function (rid, vals) {
    this.props.dispatch(this.state.actions.submitResponseEdit(this.props.questionID, rid, vals))
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES)
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return "You have made a " + feedbackStrings[key] + "."
      }
    }))
    return errorComponents[0]
  },

  markAsWeak: function (rid) {
    const vals = {weak: true};
    this.props.dispatch(
      this.state.actions.submitResponseEdit(this.props.questionID, rid, vals)
    )
  },

  unmarkAsWeak: function (rid) {
    const vals = {weak: false};
    this.props.dispatch(
      this.state.actions.submitResponseEdit(this.props.questionID, rid, vals)
    )
  },

  rematchResponse: function (rid) {
    var newResponse = this.props.getMatchingResponse(rid)
    if (!newResponse.found) {
      var newValues = {
        text: this.props.response.text,
        count: this.props.response.count
      }
      this.props.dispatch(
        this.state.actions.setUpdatedResponse(this.props.questionID, rid, newValues)
      )
      return
    }
    if (newResponse.response.key === this.props.response.parentID) {
      return
    }
    else {
      var newErrorResp = {
        parentID: newResponse.response.key,
        feedback: this.generateFeedbackString(newResponse)
      }
      this.updateRematchedResponse(rid, newErrorResp)
    }
  },

  chooseConcept: function(e) {
    this.setState({selectedBoilerplate: this.refs.concept.value})
  },

  incrementResponse: function (rid) {
    this.props.dispatch(this.state.actions.incrementResponseCount(this.props.questionID, rid));
  },

  removeLinkToParentID: function (rid) {
    this.props.dispatch(this.state.actions.removeLinkToParentID(this.props.questionID, rid));
  },

  applyDiff: function (answer, response) {
    answer = answer || '';
    response = response || '';
    var diff = jsDiff.diffWords(response, answer);
    var spans = diff.map(function (part) {
      var fontWeight = part.added ? 'bold' : 'normal';
      var fontStyle = part.removed ? 'oblique' : 'normal';
      var divStyle = {
        fontWeight,
        fontStyle
      };
      return <span style={divStyle}>{part.value}</span>;
    });
    return spans;
  },

  handleFeedbackChange: function (e) {
    if(e==="Select specific boilerplate feedback") {
      this.setState({feedback: ""})
    } else {
      this.setState({feedback: e});
    }
  },

  conceptsFeedbackToOptions: function () {
    return hashToCollection(this.props.conceptsFeedback.data).map((cfs) => {
      return (
        <option value={cfs.feedbackText}>{cfs.name}</option>
      )
    })
  },

  conceptsToOptions: function() {
    return _.map(this.props.concepts.data["0"], (concept)=>{
      return (
        {name: concept.displayName, value: concept.uid, shortenedName: concept.name}
      )
    })
  },

  selectConceptForResult: function (e) {
    this.setState({
      newConceptResult: Object.assign({},
        this.state.newConceptResult,
        {
          conceptUID: e.value
        }
      )
    })
  },

  markNewConceptResult: function () {
    this.setState({
      newConceptResult: Object.assign({},
        this.state.newConceptResult,
        {
          correct: !this.state.newConceptResult.correct
        }
      )
    })
  },

  saveNewConceptResult: function () {
    this.props.dispatch(this.state.actions.submitNewConceptResult(this.props.questionID, this.props.response.key, this.state.newConceptResult))
  },

  deleteConceptResult: function(crid) {
    if(confirm("Are you sure?")) {
      this.props.dispatch(this.state.actions.deleteConceptResult(this.props.questionID, this.props.response.key, crid))
    }
  },
  chooseBoilerplateCategory: function(e) {
    this.setState({selectedBoilerplateCategory: e.target.value})
  },

  chooseSpecificBoilerplateFeedback: function(e) {
    this.setState({selectedBoilerplate: e.target.value})
  },

  boilerplateCategoriesToOptions: function() {
    return getBoilerplateFeedback().map((category) => {
      return (
        <option className="boilerplate-feedback-dropdown-option">{category.description}</option>
      )
    })
  },

  boilerplateSpecificFeedbackToOptions: function(selectedCategory) {
    return selectedCategory.children.map((childFeedback) => {
      return (
        <option className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
      )
    })
  },

  renderBoilerplateCategoryDropdown: function() {
    const style = {"marginRight": "20px"}
    return (
      <span className="select" style={style}>
        <select className="boilerplate-feedback-dropdown" onChange={this.chooseBoilerplateCategory} ref="boilerplate">
          <option className="boilerplate-feedback-dropdown-option">Select boilerplate feedback category</option>
          {this.boilerplateCategoriesToOptions()}
        </select>
      </span>
    )
  },

  renderBoilerplateCategoryOptionsDropdown: function() {
    const selectedCategory = _.find(getBoilerplateFeedback(), {description: this.state.selectedBoilerplateCategory});
    if(selectedCategory) {
      return (
        <span className="select">
          <select className="boilerplate-feedback-dropdown" onChange={this.chooseSpecificBoilerplateFeedback} ref="boilerplate">
            <option className="boilerplate-feedback-dropdown-option">Select specific boilerplate feedback</option>
            {this.boilerplateSpecificFeedbackToOptions(selectedCategory)}
          </select>
        </span>
      )
    } else {
      return (<span />)
    }
  },

  renderConceptResults: function (mode) {
    if (this.props.response.conceptResults) {
      return hashToCollection(this.props.response.conceptResults).map((cr) => {
        const concept = _.find(this.props.concepts.data["0"], {uid: cr.conceptUID})
        let deleteIcon
        if(mode==="Editing") {
          deleteIcon = <button onClick={this.deleteConceptResult.bind(null, cr.key)}>{"Delete"}</button>
        } else {
          deleteIcon = <span/>
        }

        if(concept) {
          return (
            <li>
              {concept.displayName} {cr.correct ? <span className="tag is-small is-success">Correct</span> : <span className="tag is-small is-danger">Incorrect</span>}
              {"\t"}
              {deleteIcon}
            </li>
          )
        } else {
          return (
            <div></div>
          )
        }
      })
    } else {
      const concept = _.find(this.props.concepts.data["0"], {uid: this.props.conceptID})
      // console.log("ConceptID from props: ", this.props)
      if(concept) {
        return (
          <li>{concept.displayName} {this.props.response.optimal ? <span className="tag is-small is-success">Correct</span> : <span className="tag is-small is-danger">Incorrect</span>}
              <br /> <strong>*This concept is only a default display that has not yet been saved*</strong>
          </li>
        )
      } else {
        return (
          <div></div>
        )
      }
    }
  },

  renderResponseContent: function (isEditing, response) {
    console.log("Respone: ", response.key)
    var content;
    var parentDetails;
    var childDetails;
    var pathwayDetails;
    var authorDetails;
    if (!this.props.expanded) {
      return
    }
    if (!response.parentID) {
      childDetails = (
        <a className="button is-outlined has-top-margin" onClick={this.viewChildResponses.bind(null, response.key)} key='view' >View Children</a>
      );
    }


    if (response.parentID) {
      const parent = this.props.getResponse(response.parentID);
      const diffText = this.applyDiff(parent.text, response.text);
      if (isEditing) {
        parentDetails = [
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />),
          (<button className="button is-danger" onClick={this.removeLinkToParentID.bind(null, response.key)}>Remove Link to Parent </button>),
          (<br />),
          (<span><strong>Differences:</strong> {diffText}</span>),
          (<br />)]
      } else {
        parentDetails = [
          (<span><strong>Parent Feedback:</strong> {parent.feedback}</span>),
          (<br />),
          (<span><strong>Parent Text:</strong> {parent.text}</span>),
          (<br />),
          (<span><strong>Differences:</strong> {diffText}</span>),
          (<br />)]
          authorDetails = [(<span><strong>Author:</strong> {response.author}</span>),
          (<br />)]
      }
    }

    if (this.props.showPathways) {
      pathwayDetails = (<span> <a
                         className="button is-outlined has-top-margin"
                         onClick={this.printResponsePathways.bind(null, this.props.key)}
                         key='from' >
                         From Pathways
                       </a> <a
                            className="button is-outlined has-top-margin"
                            onClick={this.toResponsePathways}
                            key='to' >
                            To Pathways
                          </a></span>)
    }


    if (isEditing) {
      const fuse = {
        keys: ['shortenedName', 'name'], //first search by specific concept, then by parent and grandparent
        threshold: 0.4
      }
      content =
        <div className="content">
          {parentDetails}
          <label className="label">Feedback</label>
          <TextEditor text={this.state.feedback || ""} handleTextChange={this.handleFeedbackChange} boilerplate={this.state.selectedBoilerplate}/>

          <br />
          <label className="label">Boilerplate feedback</label>
          <div className="boilerplate-feedback-dropdown-container">
            {this.renderBoilerplateCategoryDropdown()}
            {this.renderBoilerplateCategoryOptionsDropdown()}
          </div>

          <label className="label">Grammar concept</label>
          <p className="control">
            <span className="select">
              <select onChange={this.chooseConcept} ref="concept">
                <option>Select Grammatical feedback</option>
                {this.conceptsFeedbackToOptions()}
              </select>
            </span>
          </p>

          <div className="box">
            <label className="label">Concept Results</label>
            <ul>
              {this.renderConceptResults("Editing")}
              {/*<li>Commas in lists (placeholder)</li>*/}
            </ul>

            <ConceptSelector options={this.conceptsToOptions()} placeholder="Choose a concept to add"
                             onChange={this.selectConceptForResult} fuse={fuse}/>
            <p className="control">
              <label className="checkbox">
                <input onChange={this.markNewConceptResult} checked={this.state.newConceptResult.correct} type="checkbox" />
                Correct?
              </label>
            </p>
            <button className="button" onClick={this.saveNewConceptResult}>Save Concept Result</button>
          </div>



          <p className="control">
            <label className="checkbox">
              <input ref="newResponseOptimal" defaultChecked={response.optimal} type="checkbox" />
              Optimal?
            </label>
          </p>
        </div>
    } else {
      content =
        <div className="content">
          {parentDetails}
          <strong>Feedback:</strong> <br/>
          <div dangerouslySetInnerHTML={{__html: response.feedback}}></div>
          <br/>
          <label className="label">Concept Results</label>
          <ul>
            {this.renderConceptResults("Viewing")}
          </ul>
          {authorDetails}
          {childDetails}
          {pathwayDetails}
        </div>
    }

    return (
      <div className="card-content">
        {content}
      </div>
    )
  },

  renderResponseFooter: function (isEditing, response) {
    if (!this.props.readOnly || !this.props.expanded) {
      return
    }
    var buttons;

    if (isEditing) {
      buttons = [
        (<a className="card-footer-item" onClick={this.cancelResponseEdit.bind(null, response.key)} key='cancel' >Cancel</a>),
        (<a className="card-footer-item" onClick={this.incrementResponse.bind(null, response.key)} key='increment' >Increment</a>),
        (<a className="card-footer-item" onClick={this.updateResponse.bind(null, response.key)} key='update' >Update</a>)
      ]
    } else {
      buttons = [
        (<a className="card-footer-item" onClick={this.editResponse.bind(null, response.key)} key='edit' >Edit</a>),
        (<a className="card-footer-item" onClick={this.deleteResponse.bind(null, response.key)} key='delete' >Delete</a>)
      ]
    }
    if (this.props.response.statusCode === 3) {
      if (this.props.response.weak) {
        buttons = buttons.concat([(<a className="card-footer-item" onClick={this.unmarkAsWeak.bind(null, response.key)} key='weak' >Unmark as weak</a>)])
      } else {
        buttons = buttons.concat([(<a className="card-footer-item" onClick={this.markAsWeak.bind(null, response.key)} key='weak' >Mark as weak</a>)])
      }
    }
    if (this.props.response.statusCode > 1) {
      buttons = buttons.concat([(<a className="card-footer-item" onClick={this.rematchResponse.bind(null, response.key)} key='rematch' >Rematch</a>)])
    }
    return (
      <footer className="card-footer">
        {buttons}

      </footer>
    );
  },

  responseIsCommonError: function (response) {
    return (response.feedback.includes("punctuation") || response.feedback.includes("spelling")) || response.feedback.includes("typo")
  },

  renderResponseHeader: function (response) {
    var bgColor;
    var icon;
    if (!response.feedback) {
      bgColor = "not-found-response";
    } else if (!!response.parentID) {
      var parentResponse = this.props.getResponse(response.parentID)
      bgColor = "algorithm-sub-optimal-response";
    } else {
      bgColor = (response.optimal ? "human-optimal-response" : "human-sub-optimal-response");
    }
    if (response.weak) {
      icon = "⚠️";
    }

    const authorStyle = {"marginLeft": "10px"}
    const author = response.author ? <span style={authorStyle} className="tag is-dark">{response.author}</span> : undefined
    return (
      <header className={"card-content " + bgColor + " " + this.headerClasses()} onClick={this.props.expand.bind(null, response.key)}>
        <div className="content">
          <div className="media">
            <div className="media-content">
              <p>{response.text} {author}</p>
            </div>
            <div className="media-right">
              <figure className="image is-32x32">
                <span>{ icon } { response.count ? response.count : 0 }</span>
              </figure>
            </div>
          </div>
        </div>
      </header>
    );
  },

  cardClasses: function () {
    if (this.props.expanded) {
      return "has-bottom-margin has-top-margin"
    }
  },

  headerClasses: function () {
    if (!this.props.expanded) {
      return "unexpanded"
    } else {
      return "expanded"
    }
  },

  renderChildResponses: function (isViewingChildResponses, key) {
    if (isViewingChildResponses) {
      return (
        <Modal close={this.cancelChildResponseView.bind(null, key)}>
          <ResponseList
            responses={this.props.getChildResponses(key)}
            getResponse={this.props.getResponse}
            getChildResponses={this.props.getChildResponses}
            states={this.props.states}
            questionID={this.props.questionID}
            dispatch={this.props.dispatch}
            admin={false}
            expanded={this.props.allExpanded}
            expand={this.props.expand}
            ascending={this.props.ascending}
            showPathways={false}/>
        </Modal>
      )
    }
  },

  printResponsePathways: function () {
    this.viewFromResponses(this.props.response.key)
    // this.props.printPathways(this.props.response.key);
  },

  toResponsePathways: function () {
    this.viewToResponses(this.props.response.key)
    // this.props.printPathways(this.props.response.key);
  },

  renderToResponsePathways: function (isViewingToResponses, key) {
    if (isViewingToResponses) {
      return (
        <Modal close={this.cancelToResponseView.bind(null, key)}>
          <ResponseList
            responses={this.props.toPathways(this.props.response.key)}
            getResponse={this.props.getResponse}
            getChildResponses={this.props.getChildResponses}
            states={this.props.states}
            questionID={this.props.questionID}
            dispatch={this.props.dispatch}
            admin={false}
            expanded={this.props.allExpanded}
            expand={this.props.expand}
            ascending={this.props.ascending}
            showPathways={false}/>
        </Modal>
      )
    }
  },

  renderFromResponsePathways: function (isViewingFromResponses, key) {
    if (isViewingFromResponses) {
      const pathways = this.props.printPathways(this.props.response.key)
      var initialCount;
      const resps = _.reject(hashToCollection(pathways), (fromer) => {return fromer.initial === true})
      if (_.find(pathways, {initial: true})) {
        initialCount = (
          <p style={{color: 'white'}}>First attempt: {_.find(pathways, {initial: true}).pathCount}</p>
        )
      }
      return (
        <Modal close={this.cancelFromResponseView.bind(null, key)}>
          {initialCount}
        <br/>
          <ResponseList
            responses={resps}
            getResponse={this.props.getResponse}
            getChildResponses={this.props.getChildResponses}
            states={this.props.states}
            questionID={this.props.questionID}
            dispatch={this.props.dispatch}
            admin={false}
            expanded={this.props.allExpanded}
            expand={this.props.expand}
            ascending={this.props.ascending}
            showPathways={false}/>
        </Modal>
      )
    }
  },

  // gatherPathways: function () {
  //   var currentRespKey = this.props.response.key;
  //   var allResponses = _.where(this.props.responses, {key: currentRespKey})
  //   // console.log();
  // },

  // renderPathwaysButton: function () {
  //   return (
  //     <a
  //       className="button is-outlined has-top-margin"
  //       onClick={this.gatherPathways}
  //       key='view' >
  //       Print Pathways
  //     </a>
  //   );
  // },

  render: function () {
    const {response, state} = this.props;
    const isEditing = (state === (C.START_RESPONSE_EDIT + "_" + response.key));
    const isViewingChildResponses = (state === (C.START_CHILD_RESPONSE_VIEW + "_" + response.key));
    const isViewingFromResponses = (state === (C.START_FROM_RESPONSE_VIEW + "_" + response.key));
    const isViewingToResponses = (state === (C.START_TO_RESPONSE_VIEW + "_" + response.key));
    return (
      <div className={"card is-fullwidth " + this.cardClasses()}>
        {this.renderResponseHeader(response)}
        {this.renderResponseContent(isEditing, response)}
        {this.renderResponseFooter(isEditing, response)}
        {this.renderChildResponses(isViewingChildResponses, response.key)}
        {this.renderFromResponsePathways(isViewingFromResponses, response.key)}
        {this.renderToResponsePathways(isViewingToResponses, response.key)}
      </div>
    );
  }
})
