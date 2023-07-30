export const canvasProvider = 'Canvas';
export const cleverProvider = 'Clever';
export const googleProvider = 'Google';

export const providerConfigLookup = {
  [canvasProvider]: {
    importClassroomsEventName: `canvas-classroom-students-imported`,
    importClassroomsPath: `/canvas_integration/teachers/import_classrooms`,
    importStudentsEventName: `canvas-classroom-students-imported`,
    importStudentsPath: '/canvas_integration/teachers/import_students',
    isCanvas: true,
    retrieveClassroomsEventName: `canvas-classrooms-retrieved`,
    retrieveClassroomsPath: '/canvas_integration/teachers/retrieve_classrooms',
    title: 'Canvas',
  },
  [cleverProvider]: {
    importClassroomsEventName: `clever-classroom-students-imported`,
    importClassroomsPath: `/clever_integration/teachers/import_classrooms`,
    importStudentsEventName: `clever-classroom-students-imported`,
    importStudentsPath: '/clever_integration/teachers/import_students',
    isClever: true,
    retrieveClassroomsEventName: `clever-classrooms-retrieved`,
    retrieveClassroomsPath: '/clever_integration/teachers/retrieve_classrooms',
    title: 'Clever',
  },
  [googleProvider]: {
    importClassroomsEventName: `google-classroom-students-imported`,
    importClassroomsPath: `/google_integration/teachers/import_classrooms`,
    importStudentsPath: '/google_integration/teachers/import_students',
    importStudentsEventName: `google-classroom-students-imported`,
    isGoogle: true,
    retrieveClassroomsPath: '/google_integration/teachers/retrieve_classrooms',
    retrieveClassroomsEventName: `google-classrooms-retrieved`,
    title: 'Google Classroom',
  }
}
