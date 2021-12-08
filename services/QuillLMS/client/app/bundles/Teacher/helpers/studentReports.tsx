export function getTimeSpent(seconds: number) {
  if(!seconds) {
    return '';
  }
  if(seconds < 60) {
    return `<1 min`;
  }
  if(seconds >= 60 && seconds < 120) {
    return '1 min';
  }
  if(seconds >= 120 && seconds < 3600) {
    return `${Math.floor((seconds % 3600) / 60)} mins`;
  }
  if(seconds >= 3600 && seconds < 3660) {
    return '1 hr';
  }
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor((seconds % 3600) / 60)
  const hoursText = hours > 1 ? 'hrs' : 'hr';
  if(minutes) {
    const minuteText = minutes > 1 ? 'mins' : 'min';
    return `${hours} ${hoursText} ${minutes} ${minuteText}`;
  }
  return `${hours} ${hoursText}`;
}
