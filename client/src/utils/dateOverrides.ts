declare global {
  interface Date {
    getMonthName: () => string | undefined;
    getTodayDaysInMonth: () => number;
  }
}

Date.prototype.getMonthName = function () {
  switch (this.getMonth()) {
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

Date.prototype.getTodayDaysInMonth = function () {
  return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
};

export {};
