import * as React from 'react';
import { useQuery } from 'react-query';
import Title from './Title';
import { useEffect, useState } from 'react';
import TicketModal from './TicketModal';
import { fetchTickets, getActiveTickets } from '../actions/Actions';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';
import Switch from '@material-ui/core/Switch';


export default function Tickets() {
    const [open, setOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [toggleState, setToggleState] = useState(false);

    const handleToggle = () => {
        setToggleState(!toggleState);
    };
    const handleOpen = (ticket) => {
        setSelectedTicket(ticket);
        setOpen(true);
    };
      
    const handleClose = () => {
        setOpen(false);
        refetch();
    };
    
    useEffect(() => {
        refetch();
      }, [toggleState, open]);

    const { data: tickets, isLoading, isError, refetch } = useQuery(['tickets', toggleState, open], toggleState ? getActiveTickets : fetchTickets, {
        refetchOnReconnect: true,
        refetchInterval: 30000,
    });
    if (isLoading) {
    return <span>Loading...</span>;
    }

    if (isError) {
    return <span>Error: Something went wrong...</span>;
    }

    const columns = [
        { field: 'created_at', headerName: 'Date Created', width: 200, valueGetter: (value) => new Date(value * 1000).toLocaleString() },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'description', headerName: 'Description', width: 400 },
        { field: 'priority', headerName: 'Priority', width: 100 },
        { field: 'status', headerName: 'Status', width: 100 },
      ];

    return (
        <React.Fragment>
        <Grid container spacing={2}>
            <Grid item xs={6}>
            <Title>Tickets</Title>
            </Grid>
            <Grid item xs={6} style={{ flexGrow: 1, textAlign: 'right' }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <Typography>
                            {toggleState ? 'Showing active tickets' : 'Showing all tickets'}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} style={{marginTop: -5}}>
                        <Switch
                            checked={toggleState}
                            onChange={handleToggle}
                            name="toggle"
                            inputProps={{ 'aria-label': 'Toggle switch' }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <div style={{ width: '100%' }}>
            <DataGrid
                disableColumnResize
                rows={tickets}
                columns={columns}
                pageSizeOptions={[10,100]}
                onRowClick={(row) => handleOpen(row.row)}
                disableRowSelectionOnClick
                style={{cursor: 'pointer', borderRadius: '5px',}}
            />
        </div>
        <TicketModal ticket={selectedTicket} open={open} handleClose={handleClose} />
        </React.Fragment>
    );
}