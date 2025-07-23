import { createTRPCReact } from "@trpc/react-query";
import type { AppRouterType } from "@server/app.router";
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpcReact = createTRPCReact<AppRouterType>({});
export type RouterInput = inferRouterInputs<AppRouterType>;
export type RouterOutput = inferRouterOutputs<AppRouterType>;