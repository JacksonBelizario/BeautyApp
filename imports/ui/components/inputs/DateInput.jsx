import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';

const DateInput = props => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
    />
  );
};

DateInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

export default DateInput;