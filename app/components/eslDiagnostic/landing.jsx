import React from 'react'
import beginArrow from '../../img/begin_arrow.svg'
export default React.createClass({

  resume() {
    this.props.resumeActivity(this.props.session);
  },

  renderButton() {
    let onClickFn, text;
    if (this.props.session) {
      // resume session if one is passed
      onClickFn = this.resume;
      // HARDCODED
      text = <span>Resume / Reanudo</span>;
    } else {
      // otherwise begin new session
      onClickFn = this.props.begin;
      // HARDCODED
      text = <span>Begin / Comienzo</span>;
    }
    return (
      <button className="button student-begin" onClick={onClickFn}>
      {text} <img className="begin-arrow" src={beginArrow}/>
      </button>
    );
  },

  render: function () {
    // HARDCODED
    return (
      <div className="landing-page">
        <h1>
          Quill Placement Activity
        </h1>
        <p>
        You're about to answer 22 questions about writing sentences. Don't worry, it's not a test. It's just to figure out what you know.
        </p>
        <p className="second-p">
        Some of the questions might be about things you haven't learned yet &mdash; that's okay! Just answer them as best as you can. Once you're finished, Quill will create a learning plan just for you!
        </p>
        <br/>
        <h1>
          Quill Placement Actividad
        </h1>
        <p>
        Estas por responder 22 preguntas sobre oraciones. No te preocupes, esto no es un examen. Solo sirve para saber lo que ya sabes.
        </p>
        <p className="second-p">
        Algunas de las preguntas no las vas a ver aprendido antes, esta bien! No te preocupes. Solo responde las preguntas con tu mayor esfuerzo. Una ves que terminaste estas preguntas, Quill va a diseñar un plan de estudio solo para vos!
        </p>
        {this.renderButton()}
      </div>
    )
  },

})
