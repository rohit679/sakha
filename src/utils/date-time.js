import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";

const datetimeService = {};

datetimeService.convertDateByTimezone = (date, timezone) => {
  if(!timezone) {
    throw createError(
      StatusCodes.NOT_FOUND,
      'Timezone is invalid'
    );
  }

  let generatedTime = date.getTime();
  let arr = timezone.split(".");

  let addTime = { hours: arr[0], minutes: arr[1], seconds: 0 };
  if(addTime.seconds) generatedTime += 1000 * addTime.seconds;
  if(addTime.minutes) generatedTime += 1000 * 60 * addTime.minutes;
  if(addTime.hours) generatedTime += 1000 * 60 * 60 * addTime.hours;

  let futureDate = new Date(generatedTime);
  futureDate.setMilliseconds(0);
  return futureDate;
};

export { datetimeService };