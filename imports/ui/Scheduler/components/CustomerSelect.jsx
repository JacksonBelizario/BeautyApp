
import React, {useState, useEffect, useMemo, Fragment} from 'react';
import { withApollo } from 'react-apollo';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash/debounce';
import { CUSTOMERS_SEARCH } from '../../../api/customers';

const CustomerSelect = ({client, defaultValue, onChange}) => {

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const searchCustomers = async (filter) => {
      const { data } = await client.query({
        query: CUSTOMERS_SEARCH,
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
            const {searchCustomers: customers} = await searchCustomers(input);
            callback(customers);
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
          style={{ width: "100%" }}
          open={open}
          defaultValue={defaultValue}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(event, customer) => {
            onChange(customer);
          }}
          getOptionLabel={option => option.profile.name}
          options={options}
          loading={loading}
          loadingText={"Procurando"}
          noOptionsText={"Digite para procurar"}
          renderInput={params => (
            <TextField
              {...params}
              label="Cliente"
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

export default withApollo(CustomerSelect);