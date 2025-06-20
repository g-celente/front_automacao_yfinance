export default (httpClient) => ({
    getUsers: () => {
        return httpClient.get('/clients');
    },
    createUser: (data) => {
        return httpClient.post('/clients', data);
    },
        updateUser: (userId, data) => {
        return httpClient.put(`/clients/${userId}`, data);
    },
    deleteClient: (clientId) => {
        return httpClient.delete(`/clients/${clientId}`);
    },
    getUserById: (clientId) => {
        return httpClient.get(`/clients/${clientId}`);
    }
})