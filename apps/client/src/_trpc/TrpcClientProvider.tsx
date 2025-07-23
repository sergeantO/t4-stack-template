'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { ReactNode, useState } from 'react';
import { trpcReact } from './trpcClient';

export function TrpcClientProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpcReact.createClient({
            links: [
                httpBatchLink({
                    url: `${process.env.NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
                }),
            ],
        })
    );

    return (
        <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpcReact.Provider>
    );
}