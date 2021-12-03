export function getTimeSpent(seconds: number) {
  if(seconds < 60) {
    return `${seconds} seconds`;
  }
  if(seconds >= 60 && seconds < 120) {
    return '1 minute';
  }
  if(seconds >= 120 && seconds < 3600) {
    return `${Math.floor((seconds % 3600) / 60)} minutes`;
  }
  if(seconds >= 3600 && seconds < 3660) {
    return '1 hour';
  }
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor((seconds % 3600) / 60)
  if(minutes) {
    const minuteText = minutes > 1 ? 'mins' : 'min';
    return `${hours} hr ${minutes} ${minuteText}`;
  }
  return `${hours} hr`;
}
