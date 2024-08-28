import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

function DateSelector({ selectedDate, setSelectedDate }) {
  return (
    <div className='dateSelection'>
      <label htmlFor="selectDate">Sélectionner une date :</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
}

DateSelector.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  setSelectedDate: PropTypes.func.isRequired,
};

export default DateSelector;
