export function getTimeType(t) {
  const date = new Date(t);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();

  const now = new Date();
  const nyear = now.getFullYear();
  const nmonth = (now.getMonth() + 1) < 10 ? ('0' + (now.getMonth() + 1)) : now.getMonth() + 1;
  const nday = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate();

  const lmonth = nmonth - month;

  if(year < nyear || lmonth > 2) {
    return 3;
  }
  if(lmonth === 2) {
    if(nday < 16 && day > 15) return 2;
    return 3;
  }

  if(lmonth === 1) {
    if(nday < 16 && day < 16) return 2;
    if(nday < 16 && day > 15) return 1;
    if(nday > 15 && day > 15) return 2;
    return 3;
  }

  if(lmonth === 0) {
    if(day < 16 && nday > 16) return 2;
    if(day === nday) return 0;
    return 1;
  }
}