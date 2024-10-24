export default function withinTenMinutes(oldDate: Date): Date {
  const TEN_MINUTES = 10;
  const newDate = new Date(oldDate.getTime());
  newDate.setMinutes(newDate.getMinutes() + TEN_MINUTES, 0, 0);
  return newDate;
}
