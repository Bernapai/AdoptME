import { ThrottlerModuleOptions } from '@nestjs/throttler';

export interface RateLimitConfig {
    ttl: number;
    limit: number;
}

export const rateLimitConfig: ThrottlerModuleOptions = {
    throttlers: [
        {
            name: 'short',
            ttl: 60000, // 60 segundos en milisegundos
            limit: 100, // requests por ttl
        },
        {
            name: 'medium',
            ttl: 300000, // 5 minutos
            limit: 500,
        },
        {
            name: 'long',
            ttl: 3600000, // 1 hora
            limit: 1000,
        }
    ],
};