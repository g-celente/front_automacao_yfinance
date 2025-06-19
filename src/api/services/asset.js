export default (httpClient) => ({
    searchAsset: (data) => {
        return httpClient.post('/assets/search', data);
    }
})