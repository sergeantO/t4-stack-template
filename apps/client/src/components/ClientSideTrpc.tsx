"use client";

import { trpcServer } from "@client/_trpc/trpcServer";
import { useEffect, useState } from "react";

export default function ClientSideTrpc() {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        trpcServer.hello.query({ name: "Tom" })
            .then(({ greeting }) => setGreeting(greeting));
    }, []);

    return <p>Client side: {greeting}</p>;
}