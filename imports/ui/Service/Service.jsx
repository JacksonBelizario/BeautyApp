import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import { createServiceMutation, editServiceMutation } from '../../api/services';

const ServiceComponent = ({open, setOpen, createService, editService, dispatch, initial}) => {

    const _id = initial._id;
    const [name, setName] = useState(initial.name);
    const [amount, setAmount] = useState(initial.amount);
    const [duration, setDuration] = useState(initial.duration);
  
    function handleClose() {
        setOpen(false);
    }
  
    async function handleSave() {
        if (_id) {
            console.log('handleSave', {_id});
            try {
                const { data } = await editService({
                  variables: {
                    id: _id,
                    service: {
                      name,
                      amount,
                      duration
                    },
                  },
                });
        
                if (data.editService) {
                  dispatch({
                    type: 'SNACKBAR',
                    show: true,
                    message: 'Informações Editadas com sucesso!'
                  });
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
                const { data } = await createService({
                  variables: {
                    service: {
                      name,
                      duration
                    },
                  },
                });
        
                if (data.createService) {
                  dispatch({
                    type: 'SNACKBAR',
                    show: true,
                    message: 'Informações Inseridas com sucesso!'
                  });
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
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{_id ? 'Editar' : 'Novo'} Serviço</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    name="nome"
                    margin="dense"
                    label="Nome"
                    value={name}
                    type="text"
                    onChange={({ target: { value } }) => {
                        setName(value);
                    }}
                    fullWidth
                />
                <TextField
                    autoFocus
                    name="valor"
                    margin="dense"
                    label="Valor"
                    value={amount}
                    type="text"
                    onChange={({ target: { value } }) => {
                        setAmount(value);
                    }}
                    fullWidth
                />
                <TextField
                    autoFocus
                    name="duration"
                    margin="dense"
                    label="Duração"
                    value={duration}
                    type="number"
                    onChange={({ target: { value } }) => {
                        setDuration(value);
                    }}
                    fullWidth
                />
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

export const Service = compose(
    createServiceMutation,
    editServiceMutation,
    connect(state => ({
        showSnackBar: {
            message: state.showSnackBar.message,
            show: state.showSnackBar.show,
        }
  })),
)(ServiceComponent);