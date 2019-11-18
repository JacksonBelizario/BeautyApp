import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
    Grid, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem
} from '@material-ui/core';
import CpfInput from '../User/components/CpfInput';
import DateInput from '../User/components/DateInput';
import moment from 'moment';
import { validator } from '../../utils/validators';
import { createEmployeeMutation, editEmployeeMutation } from '../../api/employees';

const genders = [
  {
    value: 'm',
    label: 'Masculino',
  },
  {
    value: 'f',
    label: 'Feminino',
  },
  {
    value: 'o',
    label: 'Outro',
  },
];

const EmployeeComponent = ({open, setOpen, dispatch, initial, createEmployee, editEmployee}) => {

    const { _id, profile, emails, address } = initial;

    const emailUser = _id ? emails[0].address : '';
  
    // const [password, setPassword] = useState('');

    const [values, setValues] = useState({
      nome: {
        required: true,
        label: 'Nome',
        value: profile.name || ''
      },
      email: {
        required: true,
        label: 'Email',
        value: emailUser
      },
      senha: {
        required: !_id,
        label: 'Senha',
        value: ''
      },
      celular: {
        label: 'Celular',
        value: profile.phoneNumber || ''
      },
      dataNascimento: {
        label: 'Data de nascimento',
        value: profile.birthday ? moment(profile.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
      },
      sexo: {
        label: 'Sexo',
        value: profile.gender || ''
      },
      cpf: {
        label: 'CPF',
        value: profile.socialNumber || ''
      },
    });
                            
    const onFormChange = name => value => {
  
      const error = validator(name, value, !!values[name].required);
  
      setValues({
        ...values,
        [name]: {
          ...values[name],
          value,
          error: Boolean(error),
          helperText: error,
        }
      });
    };

    const validateAll = () => {
      const data = {
        ...Object.keys(values).reduce((carry, name) => {
          const { value } = values[name];
          const error = validator(name, value, !!values[name].required);
          carry[name] = {
            ...values[name],
            error: Boolean(error),
            helperText: error,
          }
          return carry;
        }, {})
      };
      setValues(data);
      return !Object.keys(data).filter(name => data[name].error).length;
    };
  
    function handleClose() {
        setOpen(false);
    }

    const formData = () => Object.keys(values).reduce((carry, name) => {
      carry[name] = values[name].value;
      return carry;
    }, []);
  
    async function handleSave() {
        const validForm = validateAll();
        if (validForm) {
            const {
              nome, senha, email, celular, cpf, dataNascimento, sexo, cep, logradouro,
              complemento, bairro, numero, localidade, uf
            } = formData();

            if (_id) {
                try {
                    const { data } = await editEmployee({
                      variables: {
                        id: _id,
                        employee: {
                            email,
                            password: senha,
                            profile: {
                                name: nome
                            },
                        },
                      },
                    });
            
                    if (data.editEmployee) {
                        console.log({editEmployee: data});
                        dispatch({
                            type: 'SNACKBAR',
                            show: true,
                            message: 'Informações editadas com sucesso!'
                        });
                        setOpen(false);
                    } else {
                      dispatch({
                        type: 'SNACKBAR',
                        show: true,
                        message: 'Ops, não foi possivel salvar suas alterações!'
                      });
                    }
                } catch (e) {
                    console.log('erro', e);
                }
            } else {
                try {
                    const { data } = await createEmployee({
                      variables: {
                        email,
                        password: senha,
                        profile: {
                          name: nome
                        },
                      },
                    });
            
                    if (data.createEmployee) {
                        dispatch({
                            type: 'SNACKBAR',
                            show: true,
                            message: 'Informações Inseridas com sucesso!'
                        });
                        setOpen(false);
                    } else {
                      dispatch({
                        type: 'SNACKBAR',
                        show: true,
                        message: 'Ops, não foi possivel salvar suas alterações!'
                      });
                    }
                } catch (e) {
                    console.log('erro', e);
                }
            }
        } else {
        dispatch({
            type: 'SNACKBAR',
            show: true,
            variant: 'error',
            message: 'Corrija os campos em destaque'
        });
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{_id ? 'Editar' : 'Novo'} Funcionário</DialogTitle>
            <DialogContent>
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        {...values.nome}
                        fullWidth
                        onChange={({ target: { value } }) => {
                            onFormChange('nome')(value);
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        {...values.email}
                        fullWidth
                        onChange={({ target: { value } }) => {
                            onFormChange('email')(value);
                        }}
                        disabled={!!_id}
                    />
                    </Grid>
                    {
                        (!_id) ?
                        <Grid item xs={12} sm={6}><TextField
                            {...values.senha}
                            fullWidth
                            onChange={({ target: { value } }) => {
                                onFormChange('senha')(value);
                            }}
                            disabled={!!_id}
                        /></Grid> : ''
                    }
                    <Grid item xs={12} sm={6}>
                    <TextField
                        {...values.celular}
                        fullWidth
                        onChange={({ target: { value } }) => {
                        onFormChange('celular')(value);
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        {...values.cpf}
                        fullWidth
                        onChange={({ target: { value } }) => {
                        onFormChange('cpf')(value);
                        }}
                        InputProps={{
                        inputComponent: CpfInput,
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        {...values.dataNascimento}
                        fullWidth
                        onChange={({ target: { value } }) => {
                        onFormChange('dataNascimento')(value);
                        }}
                        InputProps={{
                        inputComponent: DateInput,
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        {...values.sexo}
                        fullWidth
                        select
                        onChange={({ target: { value } }) => {
                        onFormChange('sexo')(value);
                        }}
                    >
                        {genders.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                        ))}
                    </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>)
}

export const Employee = compose(
    createEmployeeMutation,
    editEmployeeMutation,
    connect(state => ({
        showSnackBar: {
            message: state.showSnackBar.message,
            show: state.showSnackBar.show,
        }
  })),
)(EmployeeComponent);