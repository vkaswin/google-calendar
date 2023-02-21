const cookie = (() => {
  const set = <T>({
    name,
    value,
    days,
  }: {
    name: string;
    value: T;
    days: number;
  }): void => {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "; expires=" + expireDate.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
  };

  const get = (name: string): string | null => {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  const remove = (name: string): void => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  return {
    set,
    get,
    remove,
  };
})();

const debounce = <T>(
  fn: (args: T) => void,
  delay: number
): ((args: T) => void) => {
  let timeoutId: any;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const getDayName = (day: number): string | undefined => {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Wednesday";
    case 3:
      return "Tuesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return;
  }
};

const getMonthName = (month: number): string | undefined => {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "Spetember";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return;
  }
};

const getTotalDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getLastDayInMonth = (date: Date) => {
  let temp = new Date(date);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(temp.getDate() - 1);
  return date.getDate();
};

const getAllDates = (date: Date): Date[] => {
  let dates: Date[] = [];
  let temp = new Date(date);

  for (let i = 1; i <= getTotalDaysInMonth(date); i++) {
    temp.setDate(i);
    dates.push(structuredClone(temp));
  }

  temp.setDate(1);
  temp.setMonth(date.getMonth() - 1);
  let limit = dates[0].getDay() + 1;
  for (let i = 1, j = getLastDayInMonth(temp); i < limit; i++, j--) {
    temp.setDate(j);
    dates.unshift(structuredClone(temp));
  }

  temp.setMonth(date.getMonth() + 1);
  temp.setDate(1);
  for (let i = dates.length, j = 1; i < 42; i++, j++) {
    temp.setDate(j);
    dates.push(structuredClone(temp));
  }

  return dates;
};

export {
  cookie,
  debounce,
  getMonthName,
  getDayName,
  getAllDates,
  getTotalDaysInMonth,
  getLastDayInMonth,
};
