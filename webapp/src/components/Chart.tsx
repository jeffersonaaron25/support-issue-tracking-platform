import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import Title from './Title';
import { getStatusHistory } from '../actions/Actions';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

export default function Chart() {
  const theme = useTheme();
  const activeCount = localStorage.getItem('activeCount');
  const { data, isLoading, isError } = useQuery(['statusHistory', activeCount], () => getStatusHistory());
  if (isLoading) {
    return <span>Loading Status...</span>;
  }

  if (isError) {
    toast.error('Oops. Something went wrong.');
    return null;
  } 

  return (
    <React.Fragment>
      <Title>Today</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'ts',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              valueFormatter: (value) => {
                const date = new Date(value * 1000);
                const hours = date.getHours();
                const minutes = "0" + date.getMinutes();
                return `${hours}:${minutes.substr(-2)}`;
              },
           },
          ]}
          yAxis={[
            {
              label: 'Tickets',
              labelStyle: {
                ...(theme.typography.body1 as ChartsTextStyle),
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              max: data?.reduce((max, entry) => Math.max(max, entry.count), 0) + 1,
              min: 0,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'count',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}