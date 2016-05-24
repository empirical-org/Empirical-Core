import React from 'react'

export default React.createClass({
  render: function () {
    return (
      <section className="hero section is-fullheight minus-nav">
        <div className="hero-body">
          <div className="container has-text-centered">

            <h2 className="title is-3">
              🏆 Great job! {this.props.caption}:
            </h2>

              <img style={{maxHeight: '70vh', margin: '0 auto 20px'}} src={this.props.imageUrl}/>
            <h4 className="title is-5">
              <button className="button is-primary is-large" onClick={this.startActivity}>Continue</button>
            </h4>
          </div>
        </div>
      </section>
    )
  }
})
