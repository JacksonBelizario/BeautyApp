import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, OutlinedInput } from '@material-ui/core';
import NumberFormat from 'react-number-format';

const MoneyInputComponent = props => {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.floatValue,
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            prefix={'R$ '}
        />
    );
};

MoneyInputComponent.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export const MoneyInput = ({ moneyValue, setMoneyValue, placeholder }) => (
    <FormControl variant="outlined" color="primary">
        <OutlinedInput
            placeholder={placeholder || ''}
            value={moneyValue}
            onChange={e => setMoneyValue(e.target.value)}
            id="formatted-text-mask-input"
            inputComponent={MoneyInputComponent}
            labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
        />
    </FormControl>
);

export default MoneyInputComponent;