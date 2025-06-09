import { Hono } from 'hono';
import './config/firebaseAdmin';
declare const app: Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
export default app;
