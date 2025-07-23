import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { TrpcService } from './_trpc/trpc.service';

const helloReq = z.object({ name: z.string().optional() });
const helloResp = z.object({ greeting: z.string() });

@Injectable()
export class AppRouter {
    constructor(private readonly trpc: TrpcService) { }

    public get appRouter() {
        return this.trpc.router({
            hello: this.trpc.procedure
                .input(helloReq)
                .output(helloResp)
                .query(({ input }) => ({
                    greeting: `Hello ${input.name || 'Bilbo'}`
                }))
        });
    }

    async applyMiddleware(app: INestApplication) {
        app.use('/trpc', createExpressMiddleware({
            router: this.appRouter,
            createContext: ({ req, res }) => ({ req, res }),
        }));
    }
}

export type AppRouterType = AppRouter['appRouter'];