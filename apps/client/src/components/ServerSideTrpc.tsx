import { trpcServer } from "@client/_trpc/trpcServer";

export default async function ServerSideTrpc() {
    const { greeting } = await trpcServer.hello.query({ name: "Tom" });
    return <p>Server side: {greeting}</p>;
}