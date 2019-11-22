
import React, {useState, useEffect, useMemo, Fragment} from 'react';
import { withApollo } from 'react-apollo';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash/debounce';
import { EMPLOYEES_SEARCH } from '../../../api/employees';

const EmployeeSelect = ({client, onChange}) => {

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    const searchEmployees = async (filter) => {
      const { data } = await client.query({
        query: EMPLOYEES_SEARCH,
        variables: { filter },
      });
      return data;
    };
  

    const handleChange = event => {
      setInputValue(event.target.value);
    };

    const search = useMemo(
        () =>
        debounce(async (input, callback) => {
            const {searchEmployees: employees} = await searchEmployees(input);
            console.log({employees});
            callback(employees);
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

        search(inputValue, results => {
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
          id="customer-select"
          style={{ width: "100%" }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(event, newValue) => { onChange(newValue); }}
          getOptionLabel={option => option.profile.name}
          options={options}
          loading={loading}
          renderInput={params => (
            <TextField
              {...params}
              label="Funcionário"
              fullWidth
              onChange={handleChange}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
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

export default withApollo(EmployeeSelect);