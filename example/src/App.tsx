import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import DateRangePicker, { type DateRange } from 'react-native-date-ranger';

export default function App() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Date Range Picker</Text>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          showSelectionInfo
          containerStyle={styles.dateRangePicker}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1A1A1A',
  },
  dateRangePicker: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
});
