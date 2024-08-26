import React from "react";
import { useState, useEffect, useMemo } from "react";

// component types
type DateRangeType = [string, string];

// type for pre defined range
type PredefinedRanges = {
  label: string;
  range: DateRangeType;
}[];

// props type
interface Props {
  predefinedRanges?: PredefinedRanges;
  onChange: (range: DateRangeType, weekends: string[]) => void;
  startDate: string | null;
  endDate: string | null;
  setStartDate: React.Dispatch<React.SetStateAction<string | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<string | null>>;
  calculateWeekendsInRange: (start: string, end: string) => string[];
}

const DatePicker: React.FC<Props> = ({
  onChange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  calculateWeekendsInRange,
}) => {
  // states
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // Mont with label
  const generateMonthOptions = () => {
    return [
      { value: 0, label: "January" },
      { value: 1, label: "February" },
      { value: 2, label: "March" },
      { value: 3, label: "April" },
      { value: 4, label: "May" },
      { value: 5, label: "June" },
      { value: 6, label: "July" },
      { value: 7, label: "August" },
      { value: 8, label: "September" },
      { value: 9, label: "October" },
      { value: 10, label: "November" },
      { value: 11, label: "December" },
    ];
  };

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  };

  const generateDaysForMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Adding empty slots for days before the start of the month
    Array.from(Array(firstDayOfMonth)).map(() =>
      days.push({
        day: null,
        isWeekday: false,
        dateString: "",
      })
    );

    // Adding days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      const date = new Date(dateString);
      days.push({
        day: i,
        isWeekday: date.getDay() !== 0 && date.getDay() !== 6,
        dateString,
      });
    }

    return days;
  };

  // generate day for month
  const days = useMemo(
    () => generateDaysForMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  // Set start and end dates
  const handleDateClick = (date: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (new Date(date) < new Date(startDate)) {
      // Update the startDate if its already passed
      setStartDate(date);
    } else {
      // Set the end date
      setEndDate(date);
      const weekends = calculateWeekendsInRange(startDate, date);
      onChange([startDate, date], weekends); // Call parent onChange to update selected ranges
    }
  };

  useEffect(() => {
    // Reset the date range when month or year changes
    setStartDate(null);
    setEndDate(null);
  }, [selectedYear, selectedMonth]);

  return (
    <div className="container">
      {/* Year and Month select */}
      <div className="flex space-x-4 p-6">
        <select
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          value={selectedYear}
          className="p-2 border border-gray-300 rounded-md"
        >
          {generateYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          value={selectedMonth}
          className="p-2 border border-gray-300 rounded-md"
        >
          {generateMonthOptions().map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="grid grid-cols-7 gap-1 p-6" style={{ width: 300 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day.day}
            disabled={!day.isWeekday}
            onClick={() => day.dateString && handleDateClick(day.dateString)}
            className={`p-2 rounded-md ${
              day.isWeekday
                ? "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-200 cursor-not-allowed"
            } ${
              startDate === day.dateString || endDate === day.dateString
                ? "border-2 border-blue-500"
                : startDate &&
                  endDate &&
                  new Date(day.dateString) > new Date(startDate) &&
                  new Date(day.dateString) < new Date(endDate)
                ? "bg-blue-300"
                : "border border-gray-300"
            }`}
          >
            {day.day !== null ? day.day : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
