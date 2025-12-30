import { fireEvent, render } from '@testing-library/react-native';
import DateRangePicker from '../index';

const mockDate = new Date(2025, 0, 15);

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(mockDate);
});

afterAll(() => {
  jest.useRealTimers();
});

describe('DateRangePicker', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DateRangePicker />);
    expect(getByText('January 2025')).toBeTruthy();
  });

  it('renders weekday headers', () => {
    const { getByText } = render(<DateRangePicker />);
    expect(getByText('Sun')).toBeTruthy();
    expect(getByText('Mon')).toBeTruthy();
    expect(getByText('Tue')).toBeTruthy();
    expect(getByText('Wed')).toBeTruthy();
    expect(getByText('Thu')).toBeTruthy();
    expect(getByText('Fri')).toBeTruthy();
    expect(getByText('Sat')).toBeTruthy();
  });

  it('renders custom weekdays', () => {
    const customWeekdays = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];
    const { getByText } = render(<DateRangePicker weekdays={customWeekdays} />);
    expect(getByText('D')).toBeTruthy();
    expect(getByText('L')).toBeTruthy();
  });

  it('shows selection info by default', () => {
    const { getByText } = render(<DateRangePicker />);
    expect(getByText('Select date range')).toBeTruthy();
  });

  it('hides selection info when showSelectionInfo is false', () => {
    const { queryByText } = render(
      <DateRangePicker showSelectionInfo={false} />
    );
    expect(queryByText('Select date range')).toBeNull();
  });

  it('calls onChange when selecting a date', () => {
    const onChange = jest.fn();
    const { getByText } = render(<DateRangePicker onChange={onChange} />);
    fireEvent.press(getByText('10'));
    expect(onChange).toHaveBeenCalledWith({
      startDate: new Date(2025, 0, 10),
      endDate: null,
    });
  });

  it('selects date range correctly', () => {
    const onChange = jest.fn();
    const { getByText } = render(<DateRangePicker onChange={onChange} />);
    fireEvent.press(getByText('10'));
    fireEvent.press(getByText('20'));
    expect(onChange).toHaveBeenLastCalledWith({
      startDate: new Date(2025, 0, 10),
      endDate: new Date(2025, 0, 20),
    });
  });

  it('swaps dates when end date is before start date', () => {
    const onChange = jest.fn();
    const { getByText } = render(<DateRangePicker onChange={onChange} />);
    fireEvent.press(getByText('20'));
    fireEvent.press(getByText('10'));
    expect(onChange).toHaveBeenLastCalledWith({
      startDate: new Date(2025, 0, 10),
      endDate: new Date(2025, 0, 20),
    });
  });

  it('resets selection when both dates are already selected', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DateRangePicker
        value={{
          startDate: new Date(2025, 0, 10),
          endDate: new Date(2025, 0, 20),
        }}
        onChange={onChange}
      />
    );
    fireEvent.press(getByText('15'));
    expect(onChange).toHaveBeenCalledWith({
      startDate: new Date(2025, 0, 15),
      endDate: null,
    });
  });

  it('navigates to previous month', () => {
    const { getByText } = render(<DateRangePicker />);
    fireEvent.press(getByText('‹'));
    expect(getByText('December 2024')).toBeTruthy();
  });

  it('navigates to next month', () => {
    const { getByText } = render(<DateRangePicker />);
    fireEvent.press(getByText('›'));
    expect(getByText('February 2025')).toBeTruthy();
  });

  it('opens month/year picker modal when pressing month title', () => {
    const { getByText } = render(<DateRangePicker />);
    fireEvent.press(getByText('January 2025'));
    expect(getByText('Select Month & Year')).toBeTruthy();
  });

  it('uses custom selectMonthYearTitle', () => {
    const { getByText } = render(
      <DateRangePicker selectMonthYearTitle="Choose Date" />
    );
    fireEvent.press(getByText('January 2025'));
    expect(getByText('Choose Date')).toBeTruthy();
  });

  it('uses custom doneButtonText', () => {
    const { getByText } = render(<DateRangePicker doneButtonText="OK" />);
    fireEvent.press(getByText('January 2025'));
    expect(getByText('OK')).toBeTruthy();
  });

  it('selects month from picker', () => {
    const { getByText, getAllByText } = render(<DateRangePicker />);
    fireEvent.press(getByText('January 2025'));
    const marchButtons = getAllByText('March');
    fireEvent.press(marchButtons[0]!);
    expect(getByText('March 2025')).toBeTruthy();
  });

  it('renders with initialMonth', () => {
    const { getByText } = render(
      <DateRangePicker initialMonth={new Date(2024, 5, 1)} />
    );
    expect(getByText('June 2024')).toBeTruthy();
  });

  it('works as controlled component', () => {
    const { getByText } = render(
      <DateRangePicker
        value={{
          startDate: new Date(2025, 0, 5),
          endDate: new Date(2025, 0, 10),
        }}
      />
    );
    expect(getByText('Jan 5 - Jan 10, 2025')).toBeTruthy();
  });

  it('applies custom theme', () => {
    const customTheme = {
      primaryColor: '#FF0000',
      backgroundColor: '#000000',
    };
    const { getByText } = render(<DateRangePicker theme={customTheme} />);
    expect(getByText('January 2025')).toBeTruthy();
  });

  it('uses custom locale for date formatting', () => {
    const { getByText } = render(<DateRangePicker locale="de-DE" />);
    expect(getByText('Januar 2025')).toBeTruthy();
  });

  it('displays custom selectDateRangeText', () => {
    const { getByText } = render(
      <DateRangePicker selectDateRangeText="Pick your dates" />
    );
    expect(getByText('Pick your dates')).toBeTruthy();
  });

  it('displays custom selectEndDateText', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DateRangePicker onChange={onChange} selectEndDateText="Pick end" />
    );
    fireEvent.press(getByText('10'));
    expect(getByText(/Pick end/)).toBeTruthy();
  });

  it('renders custom months', () => {
    const customMonths = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const { getByText } = render(<DateRangePicker months={customMonths} />);
    fireEvent.press(getByText('January 2025'));
    expect(getByText('Enero')).toBeTruthy();
    expect(getByText('Febrero')).toBeTruthy();
  });
});
