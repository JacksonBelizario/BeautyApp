import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';

const ZipCodeInput = props => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
    />
  );
};

ZipCodeInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

export default ZipCodeInput;