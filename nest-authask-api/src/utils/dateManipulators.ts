import { HttpException, HttpStatus } from '@nestjs/common';

export function validateDate(dateString: string): Date {
  console.log(dateString);
  const datePattern =
    /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\.\d{3}Z$/; // "YYYY-MM-DDTHH:MM:SS.sssZ, 1900-01-01T00:00:00.000Z, 2099-12-31T23:59:59.999Z"
  if (!datePattern.test(dateString)) {
    throw new HttpException('Invalid date format.', HttpStatus.BAD_REQUEST);
  }

  const dateTimeParts = dateString.split('T');
  const dateParts = dateTimeParts[0].split('-');
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);

  const date = new Date(dateString);
  if (
    // JS converts invalid dates to valid ones, so we need to check if the date is the same as the one we parsed, if it's not converted, it means it's valid
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    throw new HttpException('Invalid date.', HttpStatus.BAD_REQUEST);
  }

  // i don't need to do the same with the timepart because the REGEX already checks if it's a valid time, 00:00 to 23:59

  console.log(date);

  return date; // returns a valid date
}
