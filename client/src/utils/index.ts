const cookie = {
  set: <T>({
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
  },

  get: (name: string): string | null => {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  },

  remove: (name: string): void => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};

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

const getAllDates = (date: Date): Date[] => {
  let dates: Date[] = [];
  let temp = new Date(date);

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

const timeSlots = [
  {
    time: "12:00 PM - 1:00 AM",
    label: "12 PM",
  },
  {
    time: "1:00 AM - 2:00 AM",
    label: "1 AM",
  },
  {
    time: "2:00 AM - 3:00 AM",
    label: "2 AM",
  },
  {
    time: "3:00 AM - 4:00 AM",
    label: "3 AM",
  },
  {
    time: "4:00 AM - 5:00 AM",
    label: "4 AM",
  },
  {
    time: "5:00 AM - 6:00 AM",
    label: "5 AM",
  },
  {
    time: "6:00 AM - 7:00 AM",
    label: "6 AM",
  },
  {
    time: "7:00 AM - 8:00 AM",
    label: "7 AM",
  },
  {
    time: "8:00 AM - 9:00 AM",
    label: "8 AM",
  },
  {
    time: "9:00 AM - 10:00 AM",
    label: "9 AM",
  },
  {
    time: "10:00 AM - 11:00 AM",
    label: "10 AM",
  },
  {
    time: "11:00 AM - 12:00 AM",
    label: "11 AM",
  },
  {
    time: "12:00 AM - 1:00 PM",
    label: "12 AM",
  },
  {
    time: "1:00 PM - 2:00 PM",
    label: "1 PM",
  },
  {
    time: "2:00 PM - 3:00 PM",
    label: "2 PM",
  },
  {
    time: "3:00 PM - 4:00 PM",
    label: "3 PM",
  },
  {
    time: "4:00 PM - 5:00 PM",
    label: "4 PM",
  },
  {
    time: "5:00 PM - 6:00 PM",
    label: "5 PM",
  },
  {
    time: "6:00 PM - 7:00 PM",
    label: "6 PM",
  },
  {
    time: "7:00 PM - 8:00 PM",
    label: "7 PM",
  },
  {
    time: "8:00 PM - 9:00 PM",
    label: "8 PM",
  },
  {
    time: "9:00 PM - 10:00 PM",
    label: "9 PM",
  },
  {
    time: "10:00 PM - 11:00 PM",
    label: "10 PM",
  },
  {
    time: "11:00 PM - 12:00 PM",
    label: "11 PM",
  },
] as const;

export { cookie, timeSlots, debounce, getAllDates };
