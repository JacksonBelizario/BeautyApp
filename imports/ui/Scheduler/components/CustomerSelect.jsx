
import React, {useState, useEffect, useMemo, Fragment} from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash/debounce';

const CustomerSelect = () => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
  

    const handleChange = event => {
      setInputValue(event.target.value);
    };

    const search = useMemo(
        () =>
        debounce(async (input, callback) => {
            console.log({input});
            const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
            const countries = await response.json();
      
            callback(Object.keys(countries).map(key => countries[key].item[0]));
        }, 400),
        [],
    );

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        setLoading(true);

        search({ input: inputValue }, results => {
            if (active) {
                setOptions(results || []);
                setLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [inputValue, search]);

    return (
        <Autocomplete
          id="asynchronous-demo"
          style={{ width: 300 }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          getOptionLabel={option => option.name}
          options={options}
          loading={loading}
          renderInput={params => (
            <TextField
              {...params}
              label="Asynchronous"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
            />
          )}
        />
      );
}

export default CustomerSelect;