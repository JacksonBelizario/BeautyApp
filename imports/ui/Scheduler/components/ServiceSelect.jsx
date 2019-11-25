
import React, {useState, useEffect, useMemo, Fragment} from 'react';
import { withApollo } from 'react-apollo';
import moment from '../../../utils/moment'

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash/debounce';
import { SERVICES_SEARCH } from '../../../api/services';

const ServiceSelect = ({client, defaultValue, onChange}) => {

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const searchServices = async (filter) => {
      const { data } = await client.query({
        query: SERVICES_SEARCH,
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
            const {searchServices: services} = await searchServices(input);
            callback(services);
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
          onChange={(event, service) => {
            onChange(service);
          }}
          getOptionLabel={option => `${option.name} (${Math.floor(option.duration / 60)}:${(option.duration % 60).toString().padStart(2, '0')})`}
          options={options}
          loading={loading}
          loadingText={"Procurando"}
          noOptionsText={"Digite para procurar"}
          renderInput={params => (
            <TextField
              {...params}
              label="Serviço"
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

export default withApollo(ServiceSelect);