import * as React from 'react' 


const Article = ({activity_id, article, title}): JSX.Element => (
  <div key={activity_id} className="card article-card">
    <div className="card-header">
      <h2>{title}</h2>
    </div>
    <div className="card-body">
      <p dangerouslySetInnerHTML={{__html: article}}></p>
    </div>
    <div className="card-footer d-fl-r jc-sb">
      <div className="m-r-1 d-fl-r ai-c">When you have finished reading the passage, click done.</div>
      <button className="btn btn-primary">Done</button>
    </div>
  </div>
);

export default Article;