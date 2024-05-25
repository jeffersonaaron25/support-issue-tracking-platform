import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Typography, Accordion } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AccordionDetails, AccordionSummary, DialogContentText, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { updateTicket } from '../actions/Actions';
import Messages from './Messages';

interface TicketModalProps {
  ticket: any; // Replace with your ticket type
  open: boolean;
  handleClose: () => void;
}

export default function TicketModal({ ticket, open, handleClose }: TicketModalProps) {
  const [editedTicket, setEditedTicket] = useState(ticket);
  const [editingField, setEditingField] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    setEditedTicket(ticket);
  }, [ticket]);

  const handleSaveClick = () => {
    toast.promise(
        updateTicket(editedTicket),
         {
           loading: 'Saving...',
           success: <b>Changes saved!</b>,
           error: <b>Oops. Something went wrong.</b>,
         }
       );
    
    handleClose();
  };

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setEditedTicket({ ...editedTicket, [fieldName]: event.target.value });
  };
  
  const handleFieldBlur = () => {
    setEditingField(null);
  };

  return (
    <div>
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll='body'
      style={{padding: 30, background: 'linear-gradient(45deg, rgba(107, 61, 148, 0.2) 30%, rgba(228, 167, 201, 0.2) 90%)'}}
    >
        <div style={{padding: 30, background: 'linear-gradient(45deg, rgba(107, 61, 148, 0.4) 30%, rgba(228, 167, 201, 0.4) 90%)'}} >
        <Grid container justify="space-between">
            <Grid item>
                <DialogContentText color={theme.palette.primary.main}>
                {ticket?.id ? `Ticket ID: ${ticket.id}` : 'New Ticket'}
                </DialogContentText>
            </Grid>
            <Grid item style={{ flexGrow: 1, textAlign: 'right' }}>
                  <DialogActions>
                    <Button onClick={handleSaveClick} style={{color: theme.palette.primary.main, fontSize: '20px'}}>
                      <b>Save</b>
                    </Button>
                  </DialogActions>
            </Grid>
        </Grid>
        <DialogTitle style={{marginTop: -20}}>
            {editingField === 'title' ? (
                <TextField
                value={editedTicket?.title}
                onChange={(event) => handleFieldChange(event, 'title')}
                onBlur={handleFieldBlur}
                fullWidth
                autoFocus
                inputProps={{ style: { fontSize: '20px', fontWeight: 'bold'} }}
                variant="outlined"
                />
            ) : (
                <Typography onClick={() => handleFieldClick('title')} style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                {editedTicket?.title}
                </Typography>
            )}
        </DialogTitle>
        <Accordion 
            defaultExpanded={true} 
            style={{padding: 10, margin: 15, paddingLeft: 30, background: 'transparent', backdropFilter: 'brightness(1.1)',borderRadius: '15px'}} 
            elevation={6}
        >
        <AccordionSummary>
            <Typography style={{fontWeight: 'bold', fontSize: '20px'}}> Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={2}>
            <Grid item xs={6}>
                {editingField === 'status' ? (
                  <Typography style={{ fontSize: '18px'}}>
                  <b>Status:</b> 
                    <Autocomplete
                    options={['New', 'Open', 'In Progress', 'Closed']}
                    value={editedTicket?.status}
                    onChange={(event, newValue) => handleFieldChange({ target: { value: newValue } }, 'status')}
                    onBlur={handleFieldBlur}
                    autoFocus
                    renderInput={(params) => <TextField {...params} variant='outlined' style={{width: '50%', fontSize: '18px'}}/>}
                  />
                  </Typography>
                ) : (
                    <Typography onClick={() => handleFieldClick('status')} style={{ fontSize: '18px', cursor: 'pointer' }}>
                    <b>Status:</b> {editedTicket?.status}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={6}>
                {editingField === 'priority' ? (
                  <Typography style={{ fontSize: '18px'}}>
                    <b>Priority:</b> 
                    <Autocomplete
                    options={['Low', 'Medium', 'High']}
                    value={editedTicket?.priority}
                    onChange={(event, newValue) => handleFieldChange({ target: { value: newValue } }, 'priority')}
                    onBlur={handleFieldBlur}
                    autoFocus
                    renderInput={(params) => <TextField {...params} variant='outlined' style={{width: '50%', fontSize: '18px'}}/>}
                  />
                  </Typography>
                ) : (
                    <Typography onClick={() => handleFieldClick('priority')} style={{ fontSize: '18px', cursor: 'pointer' }}>
                    <b>Priority:</b> {editedTicket?.priority}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={6}>
                <Typography style={{fontSize: '18px'}}><b>Created:</b> {new Date(editedTicket?.created_at * 1000).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography style={{fontSize: '18px'}}><b>Updated:</b> {new Date(editedTicket?.updated_at * 1000).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography style={{fontSize: '18px'}}><b>Reported by:</b> {editedTicket?.reported_by}</Typography>
            </Grid>
            <Grid item xs={6}>
              {editingField === 'assignee' ? (
                  <Typography style={{ fontSize: '18px'}}>
                  <b>Assignee:</b>
                  <TextField
                    value={editedTicket?.assignee}
                    onChange={(event) => handleFieldChange(event, 'assignee')}
                    onBlur={handleFieldBlur}
                    autoFocus
                    inputProps={{ style: { fontSize: '18px', height: 1}}}
                    variant="outlined"
                    style={{height: 1, marginTop: -10}}
                    />
                  </Typography>

                ) : (
                    <Typography onClick={() => handleFieldClick('assignee')} style={{ fontSize: '18px', cursor: 'pointer' }}>
                    <b>Assignee:</b> {editedTicket?.assignee}
                    </Typography>
                )}
            </Grid>
            </Grid>
        </AccordionDetails>
        </Accordion>
        <Accordion 
            defaultExpanded={true} 
            style={{padding: 10, margin: 15, paddingLeft: 30, background: 'transparent', backdropFilter: 'brightness(1.1)', borderRadius: '15px'}} 
            elevation={6}
        >
        <AccordionSummary>
            <Typography style={{fontWeight: 'bold', fontSize: '20px'}}> Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {editingField === 'description' ? (
                <TextField
                value={editedTicket?.description}
                onChange={(event) => handleFieldChange(event, 'description')}
                onBlur={handleFieldBlur}
                minRows={6}
                fullWidth
                multiline
                autoFocus
                variant="outlined"
                />
            ) : (
                <Typography onClick={() => handleFieldClick('description')} style={{cursor: 'pointer' }}>
                {editedTicket?.description}
                </Typography>
            )}
        </AccordionDetails>
        </Accordion>
        <Messages ticketId={editedTicket?.id} title={editedTicket?.title} />
        
      </div>
    </Dialog>
    </div>
  );
}