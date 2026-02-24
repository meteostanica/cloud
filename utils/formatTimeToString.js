import getFormatBasedOnCount from "./getFormatBasedOnCount"

export default (formats, andFunctionWord, ms) => {
  if ( !Number.isInteger(ms) ) {
    return null
  }
  
  const allocate = msUnit => {
    const units = Math.trunc(ms / msUnit)
    ms -= units * msUnit
    return units
  }
  
  const units = {
    days: allocate(86400000),
    hours: allocate(3600000),
    minutes: allocate(60000),
    seconds: allocate(1000),
    ms // remainder
  }

  let result = [];

  if (units.days > 0) {
    result.push(`${units.days} ${getFormatBasedOnCount(formats.days, units.days)}`)
  }

  if (units.hours > 0) {
    result.push(`${units.hours} ${getFormatBasedOnCount(formats.hours, units.hours)}`)
  }

  if (units.minutes > 0) {
    result.push(`${units.minutes} ${getFormatBasedOnCount(formats.minutes, units.minutes)}`)
  }

  if (units.seconds > 0) {
    result.push(`${units.seconds} ${getFormatBasedOnCount(formats.seconds, units.seconds)}`)
  }

  const last = result.pop();
  return result.join(', ') + ` ${andFunctionWord} ` + last
}
