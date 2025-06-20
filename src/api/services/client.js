export default (httpClient) => ({
    getUsers: () => {
        return httpClient.get('/clients');
    },
    createUser: (data) => {
        return httpClient.post('/clients', data);
    },
})