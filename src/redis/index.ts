import redis from "redis";

export const client = redis.createClient({
    host: '127.0.0.1',
    port:6379,
 });