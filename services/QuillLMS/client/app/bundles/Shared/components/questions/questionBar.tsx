import * as React from 'react';

const QuestionBar = (props: any) => (
  <div style={{ height: 10, marginBottom: 15, }}>
    {
      props.data.map((d: any, i: number) => (
        <div
          key={i}
          style={{
            backgroundColor: d.color,
            display: 'inline-block',
            width: `${d.value}%`,
            height: '100%', }}
        />
      ))
    }
  </div>
)

export { QuestionBar };

