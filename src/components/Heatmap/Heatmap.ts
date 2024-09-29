export interface Value {
  date: Date | string;
  count: number;
  id: string;
}

export interface Activity {
  count: number;
  id: string;
  colorIndex: number;
}

export type Activities = Map<string, Activity>;

export interface CalendarItem {
  date: Date;
  count?: number;
  id?: string;
  colorIndex: number;
}

export type Calendar = CalendarItem[][];

export interface Month {
  value: number;
  index: number;
}

export interface Locale {
  months: string[];
  days: string[];
  on: string;
  less: string;
  more: string;
}

export type TooltipFormatter = (item: CalendarItem, unit: string) => string;

export class Heatmap {
  static readonly DEFAULT_RANGE_COLOR_LIGHT = [
    "#ebedf0",
    "#dae2ef",
    "#c0ddf9",
    "#73b3f3",
    "#3886e1",
    "#17459e",
  ];
  static readonly DEFAULT_RANGE_COLOR_DARK = [
    "#1f1f22",
    "#1e334a",
    "#1d466c",
    "#1d5689",
    "#1d69ac",
    "#1B95D1",
  ];
  static readonly DEFAULT_LOCALE: Locale = {
    months: ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    days: ["Zo", "Ma", "Di", "Wo", "Do", "Vrij", "Za"],
    on: "op",
    less: "Minder",
    more: "Meer",
  };
  static readonly DAYS_IN_WEEK = 7;

  startDate: Date;
  endDate: Date;
  startWeekday: number;
  max: number;

  private _values: Value[];
  private _firstFullWeekOfMonths?: Month[];
  private _activities?: Activities;
  private _calendar?: Calendar;

  constructor(endDate: Date | string, values: Value[], startWeekday: number = 0) {
    this.startDate = this.shiftDate(endDate, -365);
    this.endDate = this.parseDate(endDate);
    this.startWeekday = startWeekday;
    this.max = Math.ceil((Math.max(...values.map((day) => day.count)) / 5) * 4);
    this._values = values;
  }

  set values(v: Value[]) {
    this.max = Math.ceil((Math.max(...v.map((day) => day.count)) / 5) * 4);
    this._values = v;
    this._firstFullWeekOfMonths = undefined;
    this._calendar = undefined;
    this._activities = undefined;
  }

  get values(): Value[] {
    return this._values;
  }

  get activities(): Activities {
    if (!this._activities) {
      this._activities = new Map();
      for (let i = 0, len = this.values.length; i < len; i++) {
        this._activities.set(this.keyDayParser(this.values[i].date), {
          count: this.values[i].count,
          id: this.values[i].id,
          colorIndex: this.getColorIndex(this.values[i].count),
        });
      }
    }
    return this._activities;
  }

  get weekCount() {
    return this.getDaysCount() / 7;
  }

  get calendar() {
    if (!this._calendar) {
      let date = this.shiftDate(this.startDate, -this.getCountEmptyDaysAtStart());
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this._calendar = new Array(this.weekCount);
      for (let i = 0, len = this._calendar.length; i < len; i++) {
        this._calendar[i] = new Array(7);
        for (let j = 0; j < 7; j++) {
          const dayValues = this.activities.get(this.keyDayParser(date));
          this._calendar![i][j] = {
            date: new Date(date.valueOf()),
            count: dayValues ? dayValues.count : undefined,
            id: dayValues ? dayValues.id : undefined,
            colorIndex: dayValues ? dayValues.colorIndex : 0,
          };
          date.setDate(date.getDate() + 1);
        }
      }
    }
    return this._calendar;
  }

  get firstFullWeekOfMonths(): Month[] {
    if (!this._firstFullWeekOfMonths) {
      const cal = this.calendar;
      this._firstFullWeekOfMonths = [];
      for (let index = 1, len = cal.length; index < len; index++) {
        const lastWeek = cal[index - 1][0].date,
          currentWeek = cal[index][0].date;
        if (
          lastWeek.getFullYear() < currentWeek.getFullYear() ||
          lastWeek.getMonth() < currentWeek.getMonth()
        ) {
          this._firstFullWeekOfMonths.push({ value: currentWeek.getMonth(), index });
        }
      }
    }
    return this._firstFullWeekOfMonths;
  }

  getColorIndex(count?: number) {
    if (count === null || count === undefined) {
      return 0;
    } else if (count <= 0) {
      return 1;
    } else if (count >= this.max) {
      return 5;
    } else {
      return Math.ceil(((count * 100) / this.max) * 0.03) + 1;
    }
  }

  getCountEmptyDaysAtStart() {
    return this.getDayOfWeek(this.startDate);
  }

  getCountEmptyDaysAtEnd() {
    return 7 - 1 - this.getDayOfWeek(this.endDate);
  }

  getDayOfWeek(day: Date) {
    return (day.getDay() - this.startWeekday + 7) % 7;
  }

  getDaysCount() {
    return 365 + 1 + this.getCountEmptyDaysAtStart() + this.getCountEmptyDaysAtEnd();
  }

  private shiftDate(date: Date | string, numDays: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  private parseDate(entry: Date | string) {
    return entry instanceof Date ? entry : new Date(entry);
  }

  private keyDayParser(date: Date | string) {
    const day = this.parseDate(date);
    return (
      String(day.getFullYear()) +
      String(day.getMonth()).padStart(2, "0") +
      String(day.getDate()).padStart(2, "0")
    );
  }
}
