import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter, Routes, Route } from "react-router-dom-v5-compat";

import ActiveClassrooms from '../components/classrooms/active_classrooms.tsx';
import ArchivedClassrooms from '../components/classrooms/archived_classrooms.tsx';

const TeacherClassroomsRouter = props => (
  <BrowserRouter>
    <CompatRouter>
      <Routes>
        <Route element={<ArchivedClassrooms {...props} />} path="/teachers/classrooms/archived" />
        <Route element={<ActiveClassrooms {...props} />} exact path="/teachers/classrooms" />
      </Routes>
    </CompatRouter>
  </BrowserRouter>
)

export default TeacherClassroomsRouter
