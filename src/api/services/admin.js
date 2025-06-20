export default (httpClient) => ({
    getUserById: () => {
        return httpClient.get(`/users`);
    }, 
});