import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouterType } from "@server/app.router";

export const trpcServer = createTRPCProxyClient<AppRouterType>({
    links: [
        httpBatchLink({
            url: `${process.env.NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
        }),
    ],
});