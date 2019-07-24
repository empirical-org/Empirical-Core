import React from 'react';

export interface StudyProps {
}

class Study extends React.Component<StudyProps, any> {
  constructor(props: StudyProps) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <p>Study Here</p>
      </div>
    );
  }
}

export default Study
