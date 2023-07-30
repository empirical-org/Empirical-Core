export const canvasProvider = 'Canvas';
export const cleverProvider = 'Clever';
export const googleProvider = 'Google';

export const providerConfigLookup = {
  [canvasProvider]: {
    className: 'canvas',
    importStudentsPath: '/canvas_integration/teachers/import_students',
    importStudentsEventName: `canvas-classroom-students-imported`,
    isCanvas: true,
    retrieveClassroomsPath: '/canvas_integration/teachers/retrieve_classrooms',
    retrieveClassroomsEventName: `canvas-classrooms-retrieved`,
    title: 'Canvas',
  },
  [cleverProvider]: {
    className: 'clever',
    importStudentsPath: '/clever_integration/teachers/import_students',
    importStudentsEventName: `clever-classroom-students-imported`,
    isClever: true,
    retrieveClassroomsPath: '/clever_integration/teachers/retrieve_classrooms',
    retrieveClassroomsEventName: `clever-classrooms-retrieved`,
    title: 'Clever',
  },
  [googleProvider]: {
    className: 'google',
    importStudentsPath: '/google_integration/teachers/import_students',
    importStudentsEventName: `google-classroom-students-imported`,
    isGoogle: true,
    retrieveClassroomsPath: '/google_integration/teachers/retrieve_classrooms',
    retrieveClassroomsEventName: `google-classrooms-retrieved`,
    title: 'Google Classroom',
  }
}

