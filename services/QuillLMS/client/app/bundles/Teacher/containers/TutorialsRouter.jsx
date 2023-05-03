import React from 'react';
import { BrowserRouter, } from 'react-router-dom';
import { CompatRouter, Routes, Route, } from "react-router-dom-v5-compat";

import TutorialIndex from '../components/tutorials/TutorialIndex';

const TutorialsRouter = () => {
  return (
    <BrowserRouter>
      <CompatRouter>
        <Routes>
          <Route element={<TutorialIndex />} path="/tutorials/:tool/:slideNumber" />
          <Route element={<TutorialIndex />} path="/tutorials/:tool" />
          <Route element={<TutorialIndex />} path="/tutorials" />
        </Routes>
      </CompatRouter>
    </BrowserRouter>
  );
};

export default TutorialsRouter;
