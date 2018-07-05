import moment from 'moment-timezone'

require('moment-transform') // eslint-disable-line

moment.tz.setDefault('America/Los_Angeles')

export default () => {
  const now = moment().tz('America/Los_Angeles')

  let reset = now.transform('YYYY-MM+01 03:00:00.000')
  if (reset.isAfter(moment().add(24, 'hours'))) {
    reset = moment().transform('YYYY-MM-DD 03:00:00.000')
  }
  return reset.toISOString()
}
