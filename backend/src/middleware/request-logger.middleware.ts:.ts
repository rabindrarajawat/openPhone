import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as geoip from 'geoip-lite';
import { CustomLogger } from '../service/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: CustomLogger) {}

    use(req: Request, res: Response, next: NextFunction) {
        // Extract IP address from headers or connection details
        let ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

        // If x-forwarded-for is a comma-separated list, use the first IP
        if (ip && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }

        // Normalize IPv6 loopback to IPv4
        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            ip = '127.0.0.1';
        }

        // Check if the IP is local
        const isLocal = ip === '127.0.0.1' || ip === 'localhost';

        // Get geolocation data for non-local IPs
        const geo = isLocal ? null : geoip.lookup(ip);

        // Log request details
        this.logger.log({
            method: req.method,
            url: req.originalUrl || req.url, // Use originalUrl if behind a proxy
            ip: ip,
            location: geo ? { city: geo.city, country: geo.country } : isLocal ? 'Localhost' : 'Location not found',
            userAgent: req.headers['user-agent'],
            time: new Date().toISOString(),
        });

        next();
    }
}
