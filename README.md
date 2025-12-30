# react-native-date-ranger

[![npm version](https://img.shields.io/npm/v/react-native-date-ranger.svg)](https://www.npmjs.com/package/react-native-date-ranger)
[![npm downloads](https://img.shields.io/npm/dm/react-native-date-ranger.svg)](https://www.npmjs.com/package/react-native-date-ranger)
[![license](https://img.shields.io/npm/l/react-native-date-ranger.svg)](https://github.com/ozgurbayram/react-native-date-ranger/blob/main/LICENSE)

A simple date range picker for React Native. No external dependencies, just works.

## Installation

```sh
npm install react-native-date-ranger
```

or

```sh
yarn add react-native-date-ranger
```

📦 [View on npm](https://www.npmjs.com/package/react-native-date-ranger)

## Basic Usage

```tsx
import DateRangePicker, { DateRange } from 'react-native-date-ranger';
import { useState } from 'react';

function App() {
  const [range, setRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateRange` | - | Controlled value |
| `onChange` | `(range: DateRange) => void` | - | Callback when selection changes |
| `initialMonth` | `Date` | Today | Starting month to display |
| `showSelectionInfo` | `boolean` | `true` | Show selected range text |
| `theme` | `DateRangePickerTheme` | - | Custom colors and spacing |
| `containerStyle` | `ViewStyle` | - | Additional container styles |
| `weekdays` | `string[]` | `['Sun', 'Mon', ...]` | Custom weekday labels |
| `months` | `string[]` | `['January', ...]` | Custom month names |
| `locale` | `string` | `'en-US'` | Locale for date formatting |
| `selectMonthYearTitle` | `string` | `'Select Month & Year'` | Modal title |
| `doneButtonText` | `string` | `'Done'` | Done button text |
| `selectDateRangeText` | `string` | `'Select date range'` | Placeholder text |
| `selectEndDateText` | `string` | `'Select end date'` | End date placeholder |

## Custom Theme

```tsx
<DateRangePicker
  value={range}
  onChange={setRange}
  theme={{
    primaryColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 10,
  }}
/>
```

## Custom Styling

```tsx
<DateRangePicker
  value={range}
  onChange={setRange}
  containerStyle={{
    width: '100%',
    height: 300,
    padding: 20,
  }}
/>
```

## License

MIT
