import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';

@Injectable()
export class TrpcService {
    private trpc = initTRPC.create();
    public procedure = this.trpc.procedure;
    public router = this.trpc.router;
}
