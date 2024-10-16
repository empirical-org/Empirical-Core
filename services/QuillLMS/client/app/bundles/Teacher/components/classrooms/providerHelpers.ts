export const canvasProvider = 'Canvas'
export const cleverProvider = 'Clever'
export const googleProvider = 'Google'
export const canvasClassroomProvider = 'Canvas'
export const cleverClassroomProvider = 'Clever'
export const googleClassroomProvider = 'Google Classroom'
export const classroomProviders = [canvasClassroomProvider, cleverClassroomProvider, googleClassroomProvider]

const importClassroomsEventName = (provider: string) => `${provider.toLowerCase()}-classroom-students-imported`
const importClassroomsPath = (provider: string) => `/${provider.toLowerCase()}_integration/teachers/import_classrooms`
const importStudentsEventName = (provider: string) => `${provider.toLowerCase()}-classroom-students-imported`
const importStudentsPath = (provider: string) => `/${provider.toLowerCase()}_integration/teachers/import_students`
const retrieveClassroomsEventName = (provider: string) => `${provider.toLowerCase()}-classrooms-retrieved`
const retrieveClassroomsPath = (provider: string) => `/${provider.toLowerCase()}_integration/teachers/retrieve_classrooms`

export const providerConfigLookup = {
  [canvasProvider]: {
    importClassroomsEventName: importClassroomsEventName(canvasProvider),
    importClassroomsPath: importClassroomsPath(canvasProvider),
    importStudentsEventName: importStudentsEventName(canvasProvider),
    importStudentsPath: importStudentsPath(canvasProvider),
    isCanvas: true,
    retrieveClassroomsEventName: retrieveClassroomsEventName(canvasProvider),
    retrieveClassroomsPath: retrieveClassroomsPath(canvasProvider),
    title: canvasClassroomProvider,
  },
  [cleverProvider]: {
    importClassroomsEventName: importClassroomsEventName(cleverProvider),
    importClassroomsPath: importClassroomsPath(cleverProvider),
    importStudentsEventName: importStudentsEventName(cleverProvider),
    importStudentsPath: importStudentsPath(cleverProvider),
    isClever: true,
    retrieveClassroomsEventName: retrieveClassroomsEventName(cleverProvider),
    retrieveClassroomsPath: retrieveClassroomsPath(cleverProvider),
    title: cleverClassroomProvider,
  },
  [googleProvider]: {
    importClassroomsEventName: importClassroomsEventName(googleProvider),
    importClassroomsPath: importClassroomsPath(googleProvider),
    importStudentsPath: importStudentsPath(googleProvider),
    importStudentsEventName: importStudentsEventName(googleProvider),
    isGoogle: true,
    retrieveClassroomsPath: retrieveClassroomsPath(googleProvider),
    retrieveClassroomsEventName: retrieveClassroomsEventName(googleProvider),
    title: googleClassroomProvider,
  }
}

