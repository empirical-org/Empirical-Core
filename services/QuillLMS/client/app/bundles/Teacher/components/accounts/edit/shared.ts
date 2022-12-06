import timezones from '../../../../../modules/timezones'

export const timeZoneOptions = timezones.map((tz) => {
  const newTz = tz
  newTz.label = `(GMT${tz.offset}) ${tz.label}`
  return newTz
}).concat({ label: 'None selected', value: null, name: null, })
