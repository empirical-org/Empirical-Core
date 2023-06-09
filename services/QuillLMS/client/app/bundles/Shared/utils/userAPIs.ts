export const fetchUserRole = async () => {
  const response = await fetch(`${process.env.DEFAULT_URL}/api/v1/users/current_user_role`);
  const role = await response.json();
  return role;
}

export const fetchUserIdsForSession = async (activitySessionId) => {
  const response = await fetch(`${process.env.DEFAULT_URL}/api/v1/users/student_and_teacher_ids_for_session/${activitySessionId}`);
  const userIds = await response.json();
  return { teacherId: userIds.teacher_id, studentId: userIds.student_id };
}
