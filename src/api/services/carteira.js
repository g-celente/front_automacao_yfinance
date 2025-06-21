export default (httpClient) => ({
    getCarteiras: () => {
        return httpClient.get('/wallets');
    },
    createCarteira: (data) => {
        return httpClient.post('/wallets', data);
    },
    updateCarteira: (walletId, data) => {
        return httpClient.put(`/wallets/${walletId}`, data);
    },
    deleteCarteira: (walletId) => {
        return httpClient.delete(`/wallets/${walletId}`);
    },
    getCarteiraById: (walletId) => {
        return httpClient.get(`/wallets/${walletId}`);
    },
    getIndicadoresCarteira: (walletId) => {
        return httpClient.get(`/wallets/${walletId}/indicadores`);
    },
});