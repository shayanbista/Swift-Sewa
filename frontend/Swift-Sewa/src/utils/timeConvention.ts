export function convertTime(time: string): string {
  let [hours, minutes] = time.split(":");
  let period = "AM";

  let hourTime: number = parseInt(hours);

  if (hourTime >= 12) {
    period = "PM";
    if (hourTime > 12) {
      hourTime -= 12;
    }
  } else if (hourTime === 0) {
    hourTime = 12;
  }

  return `${hourTime}:${minutes} ${period}`;
}
