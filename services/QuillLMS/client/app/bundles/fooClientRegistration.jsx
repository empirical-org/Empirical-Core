import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import React from 'react';
import ReactOnRails from 'react-on-rails';

const FooApp = (props) => {
  console.log("in Foo App!")
  //console.log("process.env", process.env)
  console.log("process.env.BAR", process.env.BAR)
  return (
    <>
      <p> some stuff </p>
    </>
  )
}


ReactOnRails.register({ FooApp, });
