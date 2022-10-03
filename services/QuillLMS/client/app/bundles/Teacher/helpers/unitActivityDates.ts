export const formatDateTimeForDisplay = (datetime) => {
  if (datetime.minutes()) {
    return datetime.format('MMM D, h:mma')
  }
  return datetime.format('MMM D, ha')
}
