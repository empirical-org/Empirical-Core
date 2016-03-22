import React from 'react';

export default React.createClass({
  render: function () {
    return (
      <div className="box">
        <p className="control">
          <label className="label">Name</label>
          <input
            className="input"
            type="text"
            placeholder="Ernest Hemingway" />
        </p>
        <p className="control">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="hi@me.com" />
        </p>
        <p className="control">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Something you won't forget, but others won't guess" />
        </p>
        <p className="control">
          <button className="button is-primary">Submit</button>
        </p>
      </div>
    )
  }
})
