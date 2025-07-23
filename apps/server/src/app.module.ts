import { Module } from '@nestjs/common';
import { TrpcModule } from './_trpc/trpc.module';
import { PrismaModule } from './_prisma/prisma.module';
import { AppRouter } from './app.router';

@Module({
  imports: [TrpcModule, PrismaModule],
  controllers: [],
  providers: [AppRouter],
})
export class AppModule {}
