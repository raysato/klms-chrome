export const verifyToken = (token: string) => {
    return fetch('https://lms.keio.jp/api/v1/users/self', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}