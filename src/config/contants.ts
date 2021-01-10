import environment from './environment';

if(process.env.NODE_ENV !== 'production') {
    const env = environment;
}

export const SECRET_KEY = process.env.SECRET || 'andresithoqq2$9855';

export enum COLLECTIONS {
    USERS = 'users',
    GENRES = 'genres'
}

export enum MESSAGES {
    TOKEN_INVALID = 'Token inválido, inicia sesion nuevamente'
}

export enum EXPIRE_TIME {
    H1 = 60 * 60,
    H24 = 24 * H1,
    M15 = H1 / 4,
    M20 = H1 / 3,
    D3 = H24 * 3
}

