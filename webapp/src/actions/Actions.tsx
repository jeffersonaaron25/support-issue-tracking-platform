import axios from "axios";
import { Api } from "./Apis";

const fetchTickets = async () => {
    const response = await axios.get(Api('getAllTickets'));
    return response.data.data;
}

const updateTicket = async (editedTicket) => {
    if (!editedTicket.source)
        editedTicket.source = 'Unknown';
    if (!editedTicket.reported_by)
        editedTicket.reported_by = 'Unknown';
    await axios.put(Api('updateTicket', editedTicket.id), editedTicket)
    .then((response) => {
        return response;
    })
    .catch((error) => {
        console.error('There was an error!', error);
    }
    )
  };

const fetchMessages = async (ticketId: number) => {
    if(ticketId) {
        const response = await axios.get(Api('getMessages', ticketId));
        return response.data.data;
    }
}

const sendMessage = async (ticketId: number, messageData: object) => {
    if (ticketId && messageData) {
        await axios.post(Api('createMessage', ticketId), messageData);
    }
}

const getActiveTickets = async () => {
    const response = await axios.get(Api('getActiveTickets'));
    return response.data.data;
}

const getOpenTickets = async () => {
    const response = await axios.get(Api('getOpenTickets'));
    return response.data.data;
}

const getActiveTicketChart = async () => {
    const response = await axios.get(Api('getActiveTicketChart'));
    return response.data.data;
}

const getStatusHistory = async () => {
    const response = await axios.get(Api('statusHistory'));
    return response.data.data;
}

export {
    fetchTickets,
    updateTicket,
    fetchMessages,
    sendMessage,
    getActiveTickets,
    getOpenTickets,
    getActiveTicketChart,
    getStatusHistory,
}