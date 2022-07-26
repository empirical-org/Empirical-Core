import { UserIdsForEvent } from "../interfaces";

export const isTrackableStudentEvent = (idData: UserIdsForEvent) => !!(idData && idData.studentId && idData.teacherId);
