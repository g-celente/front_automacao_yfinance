export default (httpClient) => ({
    signIn: (data) => {
        return httpClient.post('/login', data)
    },
    signUp: (data) => {
        return httpClient.post('/register', data)
    },
    logout: () => {
        return httpClient.post('/logout')
    }
})