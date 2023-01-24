export function redirectToActivity(activityId) {
  window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
};
