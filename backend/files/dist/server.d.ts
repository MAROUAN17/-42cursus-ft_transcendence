import { type FastifyInstance } from "fastify";
import { pipeline } from "stream";
import vault from "node-vault";
export declare const pump: typeof pipeline.__promisify__;
declare const app: FastifyInstance;
export declare const vaultClient: vault.client;
export default app;
//# sourceMappingURL=server.d.ts.map