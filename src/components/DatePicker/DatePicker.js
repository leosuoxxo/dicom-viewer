import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';
import DayjsUtils from '@date-io/dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export function DatePicker({ timestamp, onChange }) {
  const [selectedDate, setSelectedDate] = React.useState(dayjs(timestamp));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(parseInt(dayjs(date).format('x')));
  };

  useEffect(() => {
    setSelectedDate(dayjs(timestamp));
  }, [timestamp]);

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="YYYY-MM-DD"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

DatePicker.propTypes = {
  timestamp: PropTypes.number,
  onChange: PropTypes.func,
};
