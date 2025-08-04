import { Throttle } from '@nestjs/throttler';

export const ShortThrottle = () => Throttle({ short: { limit: 100, ttl: 60000 } });
export const MediumThrottle = () => Throttle({ medium: { limit: 500, ttl: 300000 } });
export const LongThrottle = () => Throttle({ long: { limit: 1000, ttl: 3600000 } });