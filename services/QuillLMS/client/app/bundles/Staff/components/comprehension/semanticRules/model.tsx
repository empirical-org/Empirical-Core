import * as React from "react";
import { withRouter } from 'react-router-dom';

const Model = ({ history }) => {
console.log("🚀 ~ file: model.tsx ~ line 5 ~ Model ~ history", history)

  return(
    <div className="model-container">
      Model
    </div>
  );
}

export default withRouter(Model)
