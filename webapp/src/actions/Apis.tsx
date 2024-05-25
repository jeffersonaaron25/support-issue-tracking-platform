const BASE_URL = "http://0.0.0.0:8000"

const endpointLookUp = {
    getAllTickets: "/tickets",
    getTicket: (id) => `/tickets/${id}`,
    updateTicket: (id) => `/tickets/${id}`,
    createTicket: "/tickets",
    deleteTicket: (id) => `/tickets/${id}`,
    getMessages: (id) => `/tickets/${id}/messages`,
    getActiveTickets: "/tickets/all/active",
    getOpenTickets: "/tickets/all/open",
    getActiveTicketChart: "/tickets/all/active/chart",
    oauthUrl: "/oauth/url",
    oauthVerify: "/oauth/verify",
    logout: "/logout",
    statusHistory: "/tickets/all/status_history",
    createMessage: (id) => `/tickets/${id}/message/create`
}

function Api(endpoint, param = null) {
    const endpointFunction = endpointLookUp[endpoint];
    const endpointPath = typeof endpointFunction === 'function' ? endpointFunction(param) : endpointFunction;
    return `${BASE_URL}${endpointPath}`;
}

export {
    Api,
    endpointLookUp
}