export default (data) => {

  data.forEach((u) => {
    const numberOfAssignedStudents = assignedStudentCount(u);
    if (!parsedUnits[u.unit_id]) {
      // if this unit doesn't exist yet, go create it with the info from the first ca
      parsedUnits[u.unit_id] = generateNewCaUnit(u);
    } else {
      const caUnit = parsedUnits[u.unit_id];
      if (caUnit.classrooms.findIndex(c => c.name === u.class_name) === -1) {
        // add the info and student count from the classroom if it hasn't already been done
        const classroom = {
          name: u.class_name,
          totalStudentCount: u.class_size,
          assignedStudentCount: numberOfAssignedStudents
        }
        caUnit.classrooms.push(classroom);
      }
      // if the activity info already exists, add to the completed count
      // otherwise, add the activity info if it doesn't already exist
      let completedCount, cumulativeScore;
      if (caUnit.classroomActivities.has(u.activity_id)) {
        completedCount = Number(caUnit.classroomActivities.get(u.activity_id).completedCount) + Number(u.completed_count)
        cumulativeScore = Number(caUnit.classroomActivities.get(u.activity_id).cumulativeScore) + Number(u.classroom_cumulative_score)
      } else {
        cumulativeScore = Number(u.classroom_cumulative_score)
        completedCount = Number(u.completed_count)
      }
      caUnit.classroomActivities.set(u.activity_id, classroomActivityData(u, numberOfAssignedStudents, completedCount, cumulativeScore));
    }
  });

  return orderUnits(parsedUnits);
};

const parsedUnits = {};

const classroomActivityData = (u, assignedStudentCount, completedCount, cumulativeScore) => {
  return {
    name: u.activity_name,
    caId: u.classroom_activity_id,
    activityId: u.activity_id,
    created_at: u.classroom_activity_created_at,
    activityClassificationId: u.activity_classification_id,
    classroomId: u.classroom_id,
    ownedByCurrentUser: u.owned_by_current_user === 't',
    ownerName: u.owner_name,
    createdAt: u.ca_created_at,
    dueDate: u.due_date,
    numberOfAssignedStudents: assignedStudentCount,
    cumulativeScore: cumulativeScore,
    completedCount: completedCount
  }
}

const assignedStudentCount = (u) => {
  return u.number_of_assigned_students ? u.number_of_assigned_students : u.class_size;
}

const generateNewCaUnit = (u) => {
  const numberOfAssignedStudents = assignedStudentCount(u);
  const classroom = {
    name: u.class_name,
    totalStudentCount: u.class_size,
    assignedStudentCount: numberOfAssignedStudents
  }
  const caObj = {
    classrooms: [classroom],
    classroomActivities: new Map(),
    unitId: u.unit_id,
    unitCreated: u.unit_created_at,
    unitName: u.unit_name,
  };
  caObj.classroomActivities.set(u.activity_id, {
    name: u.activity_name,
    activityId: u.activity_id,
    created_at: u.classroom_activity_created_at,
    caId: u.classroom_activity_id,
    activityClassificationId: u.activity_classification_id,
    classroomId: u.classroom_id,
    ownedByCurrentUser: u.owned_by_current_user === 't',
    ownerName: u.owner_name,
    dueDate: u.due_date,
    numberOfAssignedStudents: numberOfAssignedStudents,
    completedCount: u.completed_count,
    cumulativeScore: u.classroom_cumulative_score
  });
  return caObj;
}


const orderUnits = (units) => {
  const unitsArr = [];
  Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
  return unitsArr;
}
