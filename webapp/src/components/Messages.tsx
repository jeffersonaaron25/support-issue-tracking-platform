import { useQuery } from "react-query";
import { fetchMessages, sendMessage } from "../actions/Actions";
import toast from "react-hot-toast";
import { Accordion, AccordionSummary, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import theme from "./theme";

export default function Messages({ticketId, title}) {
    const [message, setMessage] = React.useState('');
    const [refetch, setRefetch] = React.useState(false);
    const user = localStorage.getItem('user');
    const { data: messages, isLoading, isError } = useQuery(['messages', ticketId, refetch], () => fetchMessages(ticketId));
    if (isLoading) {
    return <span>Loading messages...</span>;
    }

    if (isError) {
    toast.error('Oops. Something went wrong.');
    return null;
    }

    const handleSendMessage = (sender: string) => {
        const messageData = {
            body: message,
            subject: `Re: ${title}`,
            to: {
                email: sender
            }
        };
        toast.promise(
            sendMessage(ticketId, messageData),
            {
                loading: 'Sending...',
                success: <b>Message sent!</b>,
                error: <b>Oops. Something went wrong.</b>,
            }
        );
        setRefetch(!refetch);
    }

    return (
        <Accordion 
        defaultExpanded={true} 
        style={{padding: 10, margin: 15, paddingLeft: 30, background: 'transparent', backdropFilter: 'brightness(1.1)', borderRadius: '15px'}} 
        elevation={6}
        >
        <AccordionSummary>
            <Typography style={{fontWeight: 'bold', fontSize: '16px'}}> Messages</Typography>
        </AccordionSummary>
        {messages.map((message) => {
            return (
                <React.Fragment>
                    <div 
                    key={message.id}
                    style={{
                        background: message.sender == user ? 'linear-gradient(45deg, rgba(107, 61, 148, 0.4) 30%, rgba(228, 167, 201, 0.4) 60%)' : 'linear-gradient(45deg, rgba(228, 167, 201, 0.4) 30%, rgba(107, 61, 148, 0.4) 90%)',
                        flex: 1,    
                        borderWidth: 5, 
                        borderRadius: 10, 
                        borderColor: '#000', 
                        width: '50%',
                        margin: 10,
                        marginLeft: message.sender == user ? 'auto' : 10,
                        boxShadow: '0 10 10px rgba(0, 0, 0, 0.1)',
                        padding: 10}}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <Typography gutterBottom>
                                <b>{message.sender}</b>
                            </Typography>
                            </Grid>
                            <Grid item xs={6} style={{ flexGrow: 1, textAlign: 'right' }}>
                            <Typography gutterBottom>
                                {new Date(message.created_at * 1000).toLocaleString()}
                            </Typography>
                            </Grid>
                        </Grid>
                        <Typography gutterBottom>
                            {message.message}
                        </Typography>
                    </div>
                    
                </React.Fragment>
            )
        }
    )}
    <Grid container spacing={2}>
        <Grid item xs={10.5}>
        <TextField 
            fullWidth 
            label="Message" 
            variant="outlined" 
            value={message}
            style={{
                marginTop: 10, 
                marginBottom: 10, 
                background: 'transparent', 
                borderRadius: 10, 
                color: '#000', 
                padding: 10
            }}
            onChange={(event) => {
                setMessage(event.target.value);
            }
        }
        />
        </Grid>
        <Grid item xs={1.5}>
        <Button 
            variant="contained" 
            color='inherit'
            style={{margin: 10, padding: 10, borderRadius: 10, marginTop: 25, color: '#fff', backgroundColor: theme.palette.primary.main}}
            onClick={() => {
                handleSendMessage(messages[0].sender);
                setMessage('');
            }
        }
        >
            Send
        </Button>
        </Grid>
    </Grid>
    </Accordion>
    );
}