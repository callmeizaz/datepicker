import { useState } from "react";
import DatePicker from "./component/DatePicker";

type DateRangeType = [string, string];

function App() {
  // Local states
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);
  const [weekendsRange, setWeekendsRange] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(
    new Date().toLocaleDateString()
  );
  const [endDate, setEndDate] = useState<string | null>(null);

  // handle ranges
  const handleDateRangeChange = (range: DateRangeType, weekends: string[]) => {
    setSelectedDateRange(range);
    setWeekendsRange(weekends);
  };

  // handle predefined
  const calculateRangePredefined = (count: number) => {
    setStartDate(null);
    setEndDate(null);
    let currentDate = new Date();
    // increase current date by count
    let targetDate = new Date();
    targetDate.setDate(currentDate.getDate() - count);

    // date to string
    const currentDateString = currentDate.toISOString().split("T")[0];
    const targetDateString = targetDate.toISOString().split("T")[0];

    const weekends = calculateWeekendsInRange(
      targetDateString,
      currentDateString
    );

    setStartDate(targetDateString);
    setEndDate(currentDateString);

    handleDateRangeChange([targetDateString, currentDateString], weekends);
  };

  // calulate all weekends
  const calculateWeekendsInRange = (start: string, end: string): string[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const weekends = [];

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        weekends.push(currentDate.toISOString().split("T")[0]);
      }
    }

    return weekends;
  };

  return (
    <div className="App">
      <DatePicker
        onChange={handleDateRangeChange}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        calculateWeekendsInRange={calculateWeekendsInRange}
      />

      {/* predefined */}
      <div className="predefined px-6">
        {[7, 30].map((days) => {
          return (
            <button
              onClick={() => calculateRangePredefined(days)}
              type="button"
              className="text-gray-900 
              bg-white 
              hover:bg-gray-100 border
             border-gray-200 focus:ring-4 
              focus:outline-none 
              focus:ring-gray-100 
              font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center 
              inline-flex items-center 
              dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 
              me-2 mb-2"
            >
              Last {days} days
            </button>
          );
        })}
      </div>

      {/* results */}
      <div className="result px-6">
        <div className="selected-dates flex gap-1 mb-2">
          <h4>Selected dates are:</h4>
          <div className="flex">
            {selectedDateRange.map((date) => {
              return (
                <div
                  key={date}
                  className="relative grid select-none items-center whitespace-nowrap rounded-lg border border-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-700"
                >
                  <span className="">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="weekends-count flex gap-1">
          <h4>Weekends are:</h4>
          {weekendsRange.map((weekend) => {
            return (
              <div
                key={weekend}
                className="relative grid select-none items-center whitespace-nowrap rounded-lg border border-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-gray-700"
              >
                <span className="">
                  {new Date(weekend).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
