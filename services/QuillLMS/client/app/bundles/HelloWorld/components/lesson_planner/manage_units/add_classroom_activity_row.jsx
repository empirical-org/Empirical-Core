import React from 'react';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    border: '1px dashed #cecece',
  },
};

export default React.createClass({
  unitNameURIString() {
    return this.props.unitName ? `/${encodeURIComponent(this.props.unitName)}` : '';
  },

  render() {
    return (
      <div className="row" style={styles.row}>
        <a className="q-button bg-white text-black" href={`/teachers/classrooms/activity_planner/units/${this.props.unitId}/activities/edit${this.unitNameURIString()}`}>
          <span className="fa fa-plus" />Add More Activities To This Pack
        </a>
      </div>
    );
  },
});
