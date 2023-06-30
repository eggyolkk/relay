export interface Message {
    message: string,
    username: string,
    timestamp: string,
    user_id: string,
    _id: string
}

export interface SessionUser {
    exp: number,
    iat: number,
    jti: string,
    password: string,
    username: string,
    _id: string,
}