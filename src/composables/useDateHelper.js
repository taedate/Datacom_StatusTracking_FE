import { ref } from 'vue';
import flatpickr from 'flatpickr';
import { Thai } from 'flatpickr/dist/l10n/th.js';

export function useDateHelper() {
  const pickers = ref({});

  const formatToThaiDate = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear() + 543;
    return `${d}-${m}-${y}`;
  };

  const parseThaiDate = (dateStr) => {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split('-');
    return new Date(y - 543, m - 1, d);
  };

  const getTodayThaiDate = () => formatToThaiDate(new Date());

  const adjustYear = (instance) => {
    setTimeout(() => {
      if (instance?.currentYearElement) {
        instance.currentYearElement.value = instance.currentYear + 543;
      }
    }, 10);
  };

  const initDatePicker = (elementId, initialValue, onChangeCallback) => {
    const el = document.getElementById(elementId);
    if (!el) return null;

    const config = {
      locale: Thai,
      dateFormat: 'd-m-Y',
      disableMobile: true,
      allowInput: false,
      defaultDate: initialValue ? parseThaiDate(initialValue) : null,
      onReady: (d, s, i) => adjustYear(i),
      onMonthChange: (d, s, i) => adjustYear(i),
      onYearChange: (d, s, i) => adjustYear(i),
      onChange: (selectedDates) => {
        const newDate = selectedDates.length > 0 
          ? formatToThaiDate(selectedDates[0]) 
          : '';
        if (onChangeCallback) onChangeCallback(newDate);
        adjustYear(pickers.value[elementId]);
      }
    };

    pickers.value[elementId] = flatpickr(el, config);
    return pickers.value[elementId];
  };

  const destroyAllPickers = () => {
    Object.values(pickers.value).forEach(fp => fp && fp.destroy());
    pickers.value = {};
  };

  return {
    pickers,
    formatToThaiDate,
    parseThaiDate,
    getTodayThaiDate,
    adjustYear,
    initDatePicker,
    destroyAllPickers
  };
}
