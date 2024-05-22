import * as React from 'react';

const TitleCard: React.SFC<any> = (props) => <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: props.html }} />

export { TitleCard };

