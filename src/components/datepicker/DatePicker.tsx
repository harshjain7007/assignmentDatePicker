import React, { useState } from "react";
import { DateRangePicker, DateRangePickerProps } from "rsuite";
import "rsuite/dist/rsuite.min.css";

// Define the type for a predefined range
type PredefinedRange = {
  label: string;
  value: [Date, Date];
};

interface MyDatePickerProps {
  predefinedRanges: PredefinedRange[];
  onChange: (range: [Date, Date], weekends: Date[]) => void;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({
  predefinedRanges,
  onChange,
}) => {
  const [value, setValue] = useState<[Date, Date] | null>(null);

  // Check if a date is a weekend
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  // Handle date range change
  const handleChange: DateRangePickerProps["onChange"] = (range) => {
    if (range) {
      const [startDate, endDate] = range;
      const weekends: Date[] = [];

      // Validate range only includes weekdays
      if (isWeekend(startDate) || isWeekend(endDate)) {
        alert("Please select a range that starts and ends on weekdays.");
        return;
      }

      // Find all weekend dates within the selected range
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (isWeekend(new Date(date))) {
          weekends.push(new Date(date));
        }
      }

      // Set value and trigger onChange with the selected range and weekends
      setValue(range);
      onChange(range as [Date, Date], weekends);
    }
  };

  // Render the component
  return (
    <>
      <div className="cent">
        <DateRangePicker
          value={value}
          onChange={handleChange}
          ranges={predefinedRanges}
          placeholder="Select Date Range"
          style={{ width: 300 }}
          renderCell={(date: Date, data: Calendar) =>
            isWeekend(date) ? (
              <div style={{ color: "#ccc" }}>{date.getDate()}</div>
            ) : (
              date.getDate()
            )
          }
          showMonthAndYearPickers
        />
      </div>
    </>
  );
};

// Usage
const predefinedRanges: PredefinedRange[] = [
  {
    label: "Last 7 Days",
    value: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
  },
  {
    label: "Last 30 Days",
    value: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
  },
];

const DatePicker: React.FC = () => {
  const handleDateChange = (range: [Date, Date], weekends: Date[]) => {
    console.log("Selected Range:", range);
    console.log("Weekends within Range:", weekends);
  };

  return (
    <MyDatePicker
      predefinedRanges={predefinedRanges}
      onChange={handleDateChange}
    />
  );
};

export default DatePicker;
