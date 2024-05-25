import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { getActiveTickets } from '../actions/Actions';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';


export default function OpenCount() {
  const { data, isLoading, isError } = useQuery('activeTickets', () => getActiveTickets());
  if (isLoading) {
    return <span>Loading Count...</span>;
  }

  if (isError) {
    toast.error('Oops. Something went wrong.');
    return null;
  }
  localStorage.setItem('activeCount', data?.length);
  return (
    <React.Fragment>
      <Title>Active Tickets</Title>
      <Typography component="p" variant="h1" style={{textAlign: 'center'}}>
        {data?.length}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1, textAlign: 'center' }} gutterBottom>
        {new Date().toDateString()}
      </Typography>
    </React.Fragment>
  );
}