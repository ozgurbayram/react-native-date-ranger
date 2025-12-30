import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export interface DateRangePickerTheme {
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  primaryForegroundColor?: string;
  mutedColor?: string;
  borderColor?: string;
  secondaryColor?: string;
  borderRadius?: number;
  gap?: number;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  initialMonth?: Date;
  showSelectionInfo?: boolean;
  theme?: DateRangePickerTheme;
  containerStyle?: ViewStyle;
  weekdays?: string[];
  months?: string[];
  locale?: string;
  selectMonthYearTitle?: string;
  doneButtonText?: string;
  selectDateRangeText?: string;
  selectEndDateText?: string;
}

const DEFAULT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DEFAULT_THEME: Required<DateRangePickerTheme> = {
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  primaryColor: '#007AFF',
  primaryForegroundColor: '#FFFFFF',
  mutedColor: '#8E8E93',
  borderColor: '#E5E5EA',
  secondaryColor: '#F2F2F7',
  borderRadius: 12,
  gap: 8,
};

const getYearRange = (currentYear: number): number[] => {
  const years: number[] = [];
  const startYear = currentYear - 50;
  const endYear = currentYear + 50;
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isDateInRange = (
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!startDate || !endDate) return false;
  return date > startDate && date < endDate;
};

const DateRangePicker = ({
  value,
  onChange,
  initialMonth,
  showSelectionInfo = true,
  theme: themeProp,
  containerStyle,
  weekdays = DEFAULT_WEEKDAYS,
  months = DEFAULT_MONTHS,
  locale = 'en-US',
  selectMonthYearTitle = 'Select Month & Year',
  doneButtonText = 'Done',
  selectDateRangeText = 'Select date range',
  selectEndDateText = 'Select end date',
}: DateRangePickerProps) => {
  const theme = useMemo(
    () => ({ ...DEFAULT_THEME, ...themeProp }),
    [themeProp]
  );

  const today = useMemo(() => new Date(), []);
  const initialDate = useMemo(
    () => initialMonth || today,
    [initialMonth, today]
  );
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [internalRange, setInternalRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const yearScrollRef = useRef<any>(null);
  const monthScrollRef = useRef<any>(null);

  const dateRange = value !== undefined ? value : internalRange;

  const gap = useCallback(
    (multiplier: number) => theme.gap * multiplier,
    [theme.gap]
  );

  const formatMonthYear = useCallback(
    (year: number, month: number): string => {
      const date = new Date(year, month);
      return date.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      });
    },
    [locale]
  );

  const formatDateRange = useCallback(
    (range: DateRange): string => {
      if (!range.startDate && !range.endDate) return selectDateRangeText;
      if (range.startDate && !range.endDate) {
        return `${range.startDate.toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
        })} - ${selectEndDateText}`;
      }
      if (range.startDate && range.endDate) {
        return `${range.startDate.toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
        })} - ${range.endDate.toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}`;
      }
      return selectDateRangeText;
    },
    [locale, selectDateRangeText, selectEndDateText]
  );

  const handleRangeChange = useCallback(
    (newRange: DateRange) => {
      if (value === undefined) {
        setInternalRange(newRange);
      }
      onChange?.(newRange);
    },
    [value, onChange]
  );

  const handlePreviousMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  }, [currentMonth]);

  const handleMonthSelect = useCallback((month: number) => {
    setCurrentMonth(month);
    setShowMonthYearPicker(false);
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    setCurrentYear(year);
    setShowMonthYearPicker(false);
  }, []);

  const years = useMemo(() => getYearRange(today.getFullYear()), [today]);

  useEffect(() => {
    if (showMonthYearPicker) {
      const yearIndex = years.findIndex((y) => y === currentYear);
      const itemHeight = 44;
      setTimeout(() => {
        yearScrollRef.current?.scrollTo({
          y: yearIndex * itemHeight - 80,
          animated: false,
        });
        monthScrollRef.current?.scrollTo({
          y: currentMonth * itemHeight - 80,
          animated: false,
        });
      }, 50);
    }
  }, [showMonthYearPicker, currentYear, currentMonth, years]);

  const handleDateSelect = useCallback(
    (day: number) => {
      const selectedDate = new Date(currentYear, currentMonth, day);

      const newRange: DateRange = (() => {
        if (
          !dateRange.startDate ||
          (dateRange.startDate && dateRange.endDate)
        ) {
          return { startDate: selectedDate, endDate: null };
        }

        if (selectedDate < dateRange.startDate) {
          return { startDate: selectedDate, endDate: dateRange.startDate };
        }

        return { ...dateRange, endDate: selectedDate };
      })();

      handleRangeChange(newRange);
    },
    [currentYear, currentMonth, dateRange, handleRangeChange]
  );

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentYear, currentMonth]);

  const getDayState = useCallback(
    (day: number) => {
      const date = new Date(currentYear, currentMonth, day);
      const isStart =
        dateRange.startDate && isSameDay(date, dateRange.startDate);
      const isEnd = dateRange.endDate && isSameDay(date, dateRange.endDate);
      const isInRange = isDateInRange(
        date,
        dateRange.startDate,
        dateRange.endDate
      );
      const isToday = isSameDay(date, today);

      return { isStart, isEnd, isInRange, isToday };
    },
    [currentYear, currentMonth, dateRange, today]
  );

  const dynamicStyles = useMemo(
    () => ({
      container: {
        backgroundColor: theme.backgroundColor,
        borderRadius: theme.borderRadius,
        padding: gap(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden' as const,
      } as ViewStyle,
      header: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        marginBottom: gap(1),
        paddingHorizontal: gap(1),
      } as ViewStyle,
      navButton: {
        width: gap(5),
        height: gap(5),
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: theme.borderRadius / 2,
        backgroundColor: theme.secondaryColor,
      } as ViewStyle,
      navButtonText: {
        fontSize: 24,
        color: theme.primaryColor,
        fontWeight: '600' as const,
      } as TextStyle,
      monthTitleContainer: {
        flex: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: gap(1),
        borderRadius: theme.borderRadius / 2,
      } as ViewStyle,
      monthTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: theme.textColor,
        textAlign: 'center' as const,
      } as TextStyle,
      weekdaysRow: {
        flexDirection: 'row' as const,
      } as ViewStyle,
      weekdayCell: {
        flex: 1,
        alignItems: 'center' as const,
        paddingVertical: gap(0.5),
      } as ViewStyle,
      weekdayText: {
        fontSize: 11,
        color: theme.mutedColor,
        fontWeight: '500' as const,
      } as TextStyle,
      daysGridWrapper: {
        flex: 1,
        minHeight: 0,
      } as ViewStyle,
      daysGrid: {
        flex: 1,
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        alignContent: 'stretch' as const,
      } as ViewStyle,
      dayCell: {
        width: '14.28%' as unknown as number,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 2,
      } as ViewStyle,
      dayContent: {
        width: 28,
        height: 28,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: 14,
      } as ViewStyle,
      daySelected: {
        backgroundColor: theme.primaryColor,
      } as ViewStyle,
      dayToday: {
        borderWidth: 1.5,
        borderColor: theme.primaryColor,
      } as ViewStyle,
      dayText: {
        fontSize: 13,
        color: theme.textColor,
      } as TextStyle,
      dayTextSelected: {
        color: theme.primaryForegroundColor,
      } as TextStyle,
      todayText: {
        color: theme.primaryColor,
      } as TextStyle,
      dayInRange: {
        backgroundColor: theme.primaryColor + '20',
      } as ViewStyle,
      dayStart: {
        backgroundColor: theme.primaryColor + '20',
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
      } as ViewStyle,
      dayEnd: {
        backgroundColor: theme.primaryColor + '20',
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14,
      } as ViewStyle,
      selectionInfo: {
        paddingTop: gap(1),
        borderTopWidth: 1 / 3,
        borderTopColor: theme.borderColor,
        alignItems: 'center' as const,
      } as ViewStyle,
      selectionInfoText: {
        fontSize: 14,
        color: theme.mutedColor,
      } as TextStyle,
      backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      } as ViewStyle,
      pickerModal: {
        backgroundColor: theme.backgroundColor,
        borderRadius: theme.borderRadius,
        width: '85%' as unknown as number,
        maxHeight: '70%' as unknown as number,
        padding: gap(3),
      } as ViewStyle,
      pickerHeader: {
        marginBottom: gap(3),
        alignItems: 'center' as const,
      } as ViewStyle,
      pickerHeaderText: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: theme.textColor,
      } as TextStyle,
      pickerContent: {
        flexDirection: 'row' as const,
        marginBottom: gap(3),
      } as ViewStyle,
      pickerColumn: {
        flex: 1,
        marginHorizontal: gap(1),
      } as ViewStyle,
      pickerLabel: {
        fontSize: 12,
        color: theme.mutedColor,
        marginBottom: gap(1),
        paddingHorizontal: gap(2),
      } as TextStyle,
      pickerList: {
        maxHeight: 220,
      } as ViewStyle,
      pickerItem: {
        height: 44,
        justifyContent: 'center' as const,
        paddingHorizontal: gap(2),
        borderRadius: theme.borderRadius / 2,
      } as ViewStyle,
      pickerItemSelected: {
        backgroundColor: theme.primaryColor,
      } as ViewStyle,
      pickerItemText: {
        fontSize: 16,
        color: theme.textColor,
      } as TextStyle,
      pickerItemTextSelected: {
        color: theme.primaryForegroundColor,
      } as TextStyle,
      doneButton: {
        backgroundColor: theme.primaryColor,
        paddingVertical: gap(2),
        paddingHorizontal: gap(3),
        borderRadius: theme.borderRadius / 2,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      } as ViewStyle,
      doneButtonPressed: {
        opacity: 0.8,
      } as ViewStyle,
      doneButtonText: {
        fontSize: 16,
        color: theme.primaryForegroundColor,
        fontWeight: '600' as const,
      } as TextStyle,
    }),
    [theme, gap]
  );

  return (
    <View style={[dynamicStyles.container, containerStyle]}>
      <View style={dynamicStyles.header}>
        <Pressable
          onPress={handlePreviousMonth}
          style={dynamicStyles.navButton}
        >
          <Text style={dynamicStyles.navButtonText}>‹</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowMonthYearPicker(true)}
          style={dynamicStyles.monthTitleContainer}
        >
          <Text style={dynamicStyles.monthTitle}>
            {formatMonthYear(currentYear, currentMonth)}
          </Text>
        </Pressable>
        <Pressable onPress={handleNextMonth} style={dynamicStyles.navButton}>
          <Text style={dynamicStyles.navButtonText}>›</Text>
        </Pressable>
      </View>

      <View style={dynamicStyles.weekdaysRow}>
        {weekdays.map((day) => (
          <View key={day} style={dynamicStyles.weekdayCell}>
            <Text style={dynamicStyles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={dynamicStyles.daysGridWrapper}>
        <View style={dynamicStyles.daysGrid}>
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <View key={`empty-${index}`} style={dynamicStyles.dayCell} />
              );
            }

            const { isStart, isEnd, isInRange, isToday } = getDayState(day);

            return (
              <Pressable
                key={day}
                onPress={() => handleDateSelect(day)}
                style={[
                  dynamicStyles.dayCell,
                  isInRange && dynamicStyles.dayInRange,
                  isStart && dynamicStyles.dayStart,
                  isEnd && dynamicStyles.dayEnd,
                ]}
              >
                <View
                  style={[
                    dynamicStyles.dayContent,
                    (isStart || isEnd) && dynamicStyles.daySelected,
                    isToday && !isStart && !isEnd && dynamicStyles.dayToday,
                  ]}
                >
                  <Text
                    style={[
                      dynamicStyles.dayText,
                      (isStart || isEnd) && dynamicStyles.dayTextSelected,
                      isToday && !isStart && !isEnd && dynamicStyles.todayText,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {showSelectionInfo && (
        <View style={dynamicStyles.selectionInfo}>
          <Text style={dynamicStyles.selectionInfoText}>
            {formatDateRange(dateRange)}
          </Text>
        </View>
      )}

      <Modal
        visible={showMonthYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthYearPicker(false)}
      >
        <Pressable
          style={dynamicStyles.backdrop}
          onPress={() => setShowMonthYearPicker(false)}
        >
          <Pressable
            style={dynamicStyles.pickerModal}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={dynamicStyles.pickerHeader}>
              <Text style={dynamicStyles.pickerHeaderText}>
                {selectMonthYearTitle}
              </Text>
            </View>

            <View style={dynamicStyles.pickerContent}>
              <View style={dynamicStyles.pickerColumn}>
                <Text style={dynamicStyles.pickerLabel}>Month</Text>
                <ScrollView
                  ref={monthScrollRef}
                  style={dynamicStyles.pickerList}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month, index) => (
                    <Pressable
                      key={`month-${index}`}
                      style={[
                        dynamicStyles.pickerItem,
                        currentMonth === index &&
                          dynamicStyles.pickerItemSelected,
                      ]}
                      onPress={() => handleMonthSelect(index)}
                    >
                      <Text
                        style={[
                          dynamicStyles.pickerItemText,
                          currentMonth === index &&
                            dynamicStyles.pickerItemTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={dynamicStyles.pickerColumn}>
                <Text style={dynamicStyles.pickerLabel}>Year</Text>
                <ScrollView
                  ref={yearScrollRef}
                  style={dynamicStyles.pickerList}
                  showsVerticalScrollIndicator={false}
                >
                  {years.map((year) => (
                    <Pressable
                      key={`year-${year}`}
                      style={[
                        dynamicStyles.pickerItem,
                        currentYear === year &&
                          dynamicStyles.pickerItemSelected,
                      ]}
                      onPress={() => handleYearSelect(year)}
                    >
                      <Text
                        style={[
                          dynamicStyles.pickerItemText,
                          currentYear === year &&
                            dynamicStyles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                dynamicStyles.doneButton,
                pressed && dynamicStyles.doneButtonPressed,
              ]}
              onPress={() => setShowMonthYearPicker(false)}
            >
              <Text style={dynamicStyles.doneButtonText}>{doneButtonText}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DateRangePicker;
