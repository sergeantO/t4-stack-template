# T4 Stack: как настроить стек самостоятельно

## Содержание
1. [Мотивация](#мотивация)  
2. [T3 Stack](#t3-stack)  
3. [О моем стеке](#о-моем-стеке)  
4. [Материалы](#материалы)  
5. [Предварительная настройка](#предварительная-настройка)  
6. [Настройка Monorepo с рабочими пространствами pnpm](#настройка-monorepo-с-рабочими-пространствами-pnpm)  
7. [Создаем сервер с помощью NestJS](#создаем-сервер-с-помощью-nestjs)  
8. [Создаем приложение с помощью NextJS 13](#создаем-приложение-с-помощью-nextjs-13)  
9. [Улучшаем опыт разработки](#улучшаем-опыт-разработки)  
10. [Добавляем tRPC сервер к NestJS](#добавляем-trpc-сервер-к-nestjs)  
11. [Добавляем tRPC клиент к NextJS](#добавляем-trpc-клиент-к-nextjs)  
12. [Подключаем Prisma, создаем базу данных](#подключаем-prisma-создаем-базу-данных)  
13. [Работа со стеком на бекенде](#работа-со-стеком-на-бекенде)  
14. [Оборачиваем tRPC с помощью React Query](#оборачиваем-trpc-с-помощью-react-query)  
15. [tRPC, React Query и SSR](#trpc-react-query-и-ssr)  
16. [Шаблон](#шаблон)  



## Мотивация

Последние 4 года я работаю на одном месте и начал замечать, что теряю связь с современным JavaScript-стеком. Я люблю JavaScript-экосистему (ничего не могу с собой поделать) и решил изучить современные технологии, которых нет (и, вероятно, никогда не будет) в моём текущем проекте. Хотелось глубже погрузиться в монорепозитории, контейнеризацию, SSR и другие актуальные подходы.



## T3 Stack

Быстро обнаружил замечательный [T3 Stack](https://create.t3.gg/) — набор инструментов для веб-разработки, созданный Тео, ориентированный на простоту, модульность и сквозную безопасность типов.

Название стека происходит от:
- **T**yped React frontend (TypeScript + Next.js)
- **T**yped database client (Prisma)
- **T**yped remote procedure calls (tRPC)

Основное великолепие этого стека - принцип **"Typesafety Isn't Optional"**. Почему-то и яндекс, и гугл переводят это как "типобезопасность не является обязательной". На самом деле смысл противоположный — "безопасность типов это не опция".

Это достигается за счёт трех ключевых технологий:

### TypeScript
Именно благодаря TypeScript достигается безопастность типов. Уже 2025 год и я не думаю, что имеет смысл обсуждать TypeScript.

### Prisma
Для принципа "безопасность типов — не опция" ORM не является исключением. У Prisma есть конкуренты (TypeORM, Drizzle), но её преимущество — генерация типов для запросов в реальном времени. Это обеспечивает более строгие гарантии типов результатов запросов по сравнению с [TypeORM](https://www.prisma.io/docs/orm/more/comparisons/prisma-and-typeorm#type-safety) или [Drizzle](https://www.prisma.io/docs/orm/more/comparisons/prisma-and-drizzle).

### tRPC
Если вы используете GraphQL, может показаться, что он тоже обеспечивает безопасность типов. Однако это отличное решение для раздельных бэкенда и фронтенда (со всеми вытекающими проблемами управления версиями), а не для монорепозитория.

GraphQL требует:
- Изучения новой нетривиальной терминологии
- Процесс генерации кода
- Длительную проверку типов
- Меньшую поддержку IDE
- Увеличенный размер бандла

Вместо этого tRPC предполагает, что сервер написан на TypeScript и расположен рядом с клиентским кодом. Вы определяете роутер на сервере, экспортируете его тип TypeScript, затем импортируете тип на клиенте. Поскольку типы удаляются при компиляции — в клиентский бандл не добавляется лишний код.

### Ложка дегтя T3
Несмотря на все плюсы, T3 имеет существенный (на мой взгляд) недостаток - он смешивает бэкенд и фронтенд. Такой подход хорош для небольших проектов, но при росте приводит к "спагетти-коду", где сложно определить границы между серверной и клиентской логикой.



## T4 Stack

Решение проблемы — разделение фронтенда и бэкенда с добавлением четвёртой буквы T: **Typed NestJS backend**.

В этом руководстве мы с нуля создадим типобезопасный монорепозиторий на pnpm с использованием:
- **Бэкенд**:  NestJS, Prisma + PostgreSQL, tRPC (сервер), Zod
- **Фронтенд**: Next.js (AppRouter), tRPC (клиент), Tailwind CSS, NextAuth.js

Я влюбился в этот стек технологий - он дает отличный опыт разработки

Преимущества стека:
- Разделение фронтенда/бэкенда с сохранением их тесной интеграции
- Сквозная безопасность типов
- Доступ ко всем возможностям NestJS (DI, модули и т.д.)

## Материалы
Ресурсы, особенно полезные при подготовке статьи:
- [Creating a Project with Nest.js + Next.js](https://dev.to/yakovlev_alexey/creating-a-project-with-nestjs-nextjs-3i1i)
- [Building a full-stack monorepo with NestJS, NextJS & tRPC](https://www.tomray.dev/nestjs-nextjs-trpc)
- [How to use Prisma with NestJS](https://www.tomray.dev/nestjs-prisma)
- [NestJS Config Module](https://www.tomray.dev/nestjs-config)
- [tRPC + NextJS App Router](https://www.youtube.com/watch?v=qCLV0Iaq9zU)
- [Руководства по JavaScript/TypeScript](https://my-js.org/docs/guide/intro-guide)

## Предварительная настройка

**Требования:**
- Node.js 20+
- Docker 27+
- pnpm 9+
- NestJS CLI 10+

Установку докера и ноды описывать не буду. Установка `pnpm` и` @nestjs/cli` простая:
```bash
npm i -g pnpm
npm i -g @nestjs/cli
```

## Настройка Monorepo с рабочими пространствами pnpm

Инициализация проекта:
```bash
mkdir todo-list-guide
cd todo-list-guide
touch .gitignore
```

Добавляем в `.gitignore`:
```
node_modules
dist
build
.env
```

Инициализируем рабочие пространства(workspace) `pnpm`
```bash
pnpm init
touch pnpm-workspace.yaml
```

Наполняем `pnpm-workspace.yaml`. Все поддиректории внутри `apps/` будут являться рабочими пространствами `pnpm`.
```yaml
packages:
  - 'apps/*'
```

Создаем директорию `apps/` в корне проекта:
```bash
mkdir apps
```

## Создаем сервер с помощью NestJS
Давайте добавим приложение NestJS под названием `server`. Вы можете называть его как угодно

Генерация проекта:
```bash
cd apps
nest new server --strict --skip-git --package-manager=pnpm
```

Параметры:
> --strict Гарантирует, что конфигурация компилятора NestJS TypeScript использует строгий режим 
>
> --skip-git По умолчанию при создании нового приложения NestJS внутри инициализируется git. нам это не надо поскольку мы инициализировали git в корне проекта
>
> --package-manager=pnpm Проверяет, что приложение NestJS использует pnpm в качестве менеджера пакетов

Проверка работы:
```bash
cd server
pnpm start:dev
```
Откройте http://localhost:3000/ — должно отображаться "Hello World!".

После создания проекта Nest вы можете удалить некоторые файлы, созданные по умолчанию, поскольку они нам не понадобятся:
```
src/app.controller.spec.ts
src/app.controller.ts
src/app.service.ts
```

Вам также потребуется удалить соответствующий импорт из файла app.module.ts. Как только вы это сделаете, ваш файл app.module.ts будет выглядеть так:
```ts
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```



## Создаем приложение с помощью NextJS 13
Давайте добавим приложение NextJS 13 под названием `client`. Вы можете называть его как угодно. 

Генерация проекта:
```bash
cd ..
pnpx create-next-app@latest client --ts --eslint --tailwind --app --src-dir --use-pnpm
```

Внутри вашего каталога `apps/`теперь у вас появится новый проект NextJS. Давайте проверим, что проект NextJS работает нормально, и запустим локальный сервер: 
```bash
cd client
pnpm dev
```
Откройте http://localhost:3000/

## Улучшаем опыт разработки
Итак, теперь у нас есть два приложения в нашем монорепозитории, оба работают локально. Как мы видели, и клиент, и сервер стартуют на 3000 порту. Это надо исправить. Также добавим логирование, чтобы понимать на каком порту стартовало приложение


**Исправление конфликта портов:**
```ts
// apps/server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000; // Меняем порт
  
  await app.listen(port);
  Logger.log(`Server started on port: ${port}`, 'bootstrap')
}
bootstrap();
```

Теперь сервер будет стартовать на порту 4000, если иное не указано в `.env` файле.

Также, на следующем этапе мы добавим tRPC. Сервер tRPC будет находиться внутри приложения NestJS, а клиент tRPC — внутри приложения NextJS. 

Клиенту tRPC потребуется доступ к типу под названием AppRouterType (мы вернемся к этому в следующем разделе), который определен внутри приложения NestJS. В нашей текущей настройке это невозможно — вы можете импортировать файлы только из соответствующего приложения, в котором вы находитесь. 

Итак, давайте внесем некоторые изменения в конфигурацию компилятора TypeScript, чтобы исправить это! Мы собираемся создать новый файл `tsconfig.json` в корне проекта, который поможет делать импорты между приложениями. 

Корневой `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@server/*": ["./apps/server/src/*"],
      "@client/*": ["./apps/client/src/*"]
    }
  }
}
```

Далее нам нужно обновить файлы `tsconfig.json` в обоих приложениях (`server` и `client`), чтобы они расширяли `tsconfig.json` в корне проекта:
```json
{
  "extends": "../../tsconfig.json",
  // ... остальные настройки
}
```

Поскольку мы изменили параметры компилятора TypeScript для обоих приложений, давайте просто запустим наши локальные серверы, чтобы убедиться, что все работает. 

Вместо переходов между каталогами и создания новой вкладки терминала для каждого приложения, мы можем определить одну команду в корне проекта для одновременного запуска обоих приложений. В корне проекта откройте файл `package.json` и добавьте новый скрипт под названием `dev`:
```json
{
  // ...
  "scripts": {
    "dev": "pnpm run --parallel dev"
  }
  // ...
}
```

При этом в каталоге `app/` просматриваются все скрипты с именем `dev` и запускаются параллельно. Скрипт запуска сервера разработки NextJS уже называется `dev`, поэтому нам просто нужно переименовать скрипт запуска сервера разработки NestJS с `start:dev` на `dev`:
```json
{
  "scripts": {
    "dev": "nest start --watch" // Было "start:dev"
  }
}
```

Теперь в корне вашего каталога выполните команду: `pnpm dev`. Оба локальных сервера теперь должны работать параллельно, подтверждая, что новый скрипт работает и внесенные изменения в TSconfig также работают.
```bash
pnpm dev
```

## Добавляем tRPC сервер к NestJS

Установка зависимостей:
```bash
pnpm add @trpc/server zod --filter=server
```

Генерация модуля:
```bash
cd apps/server
nest g module _trpc
nest g service _trpc
```
> Название модуля начинается с нижнего подчеркивания, чтобы визуально разграничить технические и бизнесовые модули

Реализация сервиса (`trpc.service.ts`):
```ts
import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';

@Injectable()
export class TrpcService {
    private trpc = initTRPC.create();
    public procedure = this.trpc.procedure;
    public router = this.trpc.router;
}
```

Модуль (`trpc.module.ts`):
```ts
import { Global, Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';

@Global() // Теперь можно будет сделать иньекцию TrpcService в любой другой сервис нашего приложения
@Module({
  providers: [TrpcService],
  exports: [TrpcService]
})
export class TrpcModule {}
```

Давайте теперь добавим роутер (`app.router.ts`).
Здесь мы: 
- Определяем маршрутизаторы tRPC (т.е. методы, которые сможет вызывать клиент tRPC)
- Добавим middleware для предоставления API tRPC на нашем сервере NestJS
- Экспортируем тип AppRouterType (используется на следующем этапе при настройке клиента tRPC)
- Также, для тестирования определим первый маршрут - `hello`

```ts
import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from './_trpc/trpc.service';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

const helloReq = z.object({ name: z.string().optional() });
const helloResp = z.object({ greeting: z.string() });

@Injectable()
export class AppRouter {
  constructor(private readonly trpc: TrpcService) {}

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
```

> Я бы предложил на этом моменте установить trpc-panel, но она не работает с 11 версией trpc и 3 версией zod. И не планирует обновляться.

Последнее, что нужно сделать перед тем, как сервер tRPC будет готов, — это обновить файл `main.ts`, чтобы применить middleware, который мы определили в маршрутизаторе выше, и включить CORS:
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppRouter } from './app.router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const trpc = app.get(AppRouter);
  trpc.applyMiddleware(app);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(`Server started on port: ${port}`, 'bootstrap')
}
bootstrap();
```

## Добавляем tRPC клиент к NextJS

Установка зависимостей:
```bash
pnpm add @trpc/client @trpc/server --filter=client
```

> Пакет `@trpc/server` требуется для того, чтобы не получить ошибку зависимости от однорангового узла в монорепозитории `pnpm`

Создание клиента (`apps/client/src/_trpc/trpcServer.ts`):
```ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouterType } from "@server/app.router";

export const trpcServer = createTRPCProxyClient<AppRouterType>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
    }),
  ],
});
```

В этом файле мы определили клиент tRPC. Чтобы создать клиент tRPC, нам нужно было использовать тип `AppRouterType`, который мы экспортировали при создании сервера tRPC на предыдущем шаге. Это то, что обеспечит нам сквозную безопасность типов от начала стека до конца!

Поскольку мы создали корневой `TSconfig` и установили пути, мы можем импортировать `AppRouterType` в приложение NextJS (даже если этот тип взят из другого приложения).

Свойство `url` должно указывать на сервер tRPC, мы использовали переменную среды. Добавьте файл `.env.local` в корень вашего приложения NextJS (внутри каталога `apps/client`) и добавьте туда нашу переменную среды: `NEXT_PUBLIC_NESTJS_SERVER=http://localhost:4000`

Пример использования для клиентской стороны:
```tsx
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
```

Пример использования для серверной стороны:
```tsx
import { trpcServer } from "@client/_trpc/trpcServer";

export default async function ServerSideTrpc() {
  const { greeting } = await trpcServer.hello.query({ name: "Tom" });
  return <p>Server side: {greeting}</p>;
}
```

Интеграция на странице:
```tsx
import ClientSideTrpc from "@client/components/ClientSideTrpc";
import ServerSideTrpc from "@client/components/ServerSideTrpc";

export default async function Home() {
  return (
    <div>
      <ServerSideTrpc />
      <ClientSideTrpc />
    </div>
  );
}
```



## Подключаем Prisma, создаем базу данных

Теперь добавим `prisma` к проекту
Также хотедлсь бы создавать dto не с нуля, а с помощью модификации моделей. Давайте сделаем это!

Проблем тут три:
1. При больших моделях придется описывать все поля отдельно. 
2. При изменении модели, придется переписывать и входные типы. 
3. Приходилось сталкиваться с проблемами, когда типы выводились не корректно.

```bash
pnpm add -D prisma --filter=server
pnpm add zod-prisma --filter=server
cd apps/server
pnpx prisma init
```

Изменим настройки генератора клиента и базы `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

generator zodPrisma {
  provider = "zod-prisma"
  output   = "../src/_models"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  login     String   @unique
  password  String
}
```

Генерация модуля для Prisma:
```bash
nest g module _prisma
nest g service _prisma
```

Реализация сервиса (`apps/server/src/_prisma/prisma.service.ts`):
```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generate/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

Модуль (`apps/server/src/_prisma/prisma.module.ts`):
```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // PrismaService доступен глобально
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## Работа со стеком на бекенде

Типичный workflow для нового модуля (например, `group`):

1. Создать модуль: `nest g module group`
2. Добавить схему Prisma (если нужно) и сгенерировать типы: `prisma generate`
3. Создать zod схемы: `touch group.schema.ts` и наполняем преобразованиями из сгенерированных типов (`apps/server/src/_models`)
4. Создать сервис: `nest g service group` и наполняем логикой
5. Создать роутер: `touch group.router.ts` и формируем эндпоинты trpc
6. Добавить роутер в `GroupModule` (providers и exports)
7. Зарегистрировать роутер в `AppRouter`
8. Profit!

## Оборачиваем tRPC с помощью React Query

Вернемся к фронтенду, все работает, но есть в текущей схеме два минуса
1. В компоненте требуется создать отдельное состояние загрузки данных
2. После создания новой записи, она не появится автоматически, т.к. запрос данных и их мутация ничего не знают друг о друге (да и могут находиться в разных частях приложения)

Вот пример такого положения
```tsx
export async function GroupsPage() {
    return (
        <main className="p-4">
            <GroupCreateDialog />
            <GroupDataTable />
        </main>
    );
}

export function GroupCreateDialog() {
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false);

    const createGroup = async () => {
        await trpc.group.create.mutate({ name: name })
        setName('')
        setOpen(false)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.currentTarget.value || '');
    }

    return (
        <div>
            <Input value={name} onInput={handleChange} placeholder="Enter group name" />
            <Button onClick={createGroup}>Save changes</Button>
        </div>
    )
}

export function GroupDataTable() {
    const [data, setData] = useState([] as ItemType[])
    const [isLoading, setLoading] = useState(true)

    useEffect(async () => {
        const item = await trpcServer.items.getAll.query()
        item.then((data) => {
            setData(data)
            setLoading(false)
        })
    }, [])

    return (
        <DataTable
            columns={groupColumns}
            data={data}
            isLoading={isLoading}
        />
    );
}
```

Конечно, это можно решить самим, но зачем, если есть готовая библиотека React Query, а trpc имеет готовую обертку под нее? Надо только настроить

Установка зависимостей:
```bash
pnpm add @trpc/react-query@next @tanstack/react-query@latest --filter=client
touch apps/client/app/src/_trpc/TrpcClientProvider.tsx
touch apps/client/app/src/_trpc/trpcClient.tsx
```

Создадим клиента tRPC с React Query (`apps/client/app/src/_trpc/trpcClient.ts`):
```ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouterType } from "@server/app.router";
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpcReact = createTRPCReact<AppRouterType>({});
export type RouterInput = inferRouterInputs<AppRouterType>;
export type RouterOutput = inferRouterOutputs<AppRouterType>;
```

Создадим провайдер (`apps/client/app/src/_trpc/TrpcClientProvider.tsx`):
```tsx
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
```

Обновим корневой layout (`apps/client/app/src/layout.tsx`):
```tsx
import { TrpcClientProvider } from "@client/_trpc/TrpcClientProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TrpcClientProvider>
          {children}
        </TrpcClientProvider>
      </body>
    </html>
  );
}
```

Теперь наш код может выглядеть иначе, а как только мы добавляем новую запись - у нас происходит повторный запрос и автоматическое добавление в таблицу данных
```tsx
export function GroupCreateDialog() {
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false);

    const allGroupsQueryKey = trpcReact.group.getAll.getQueryKey()
    const addGroup = trpcReact.group.create.useMutation({
        onSettled: () => {
            queryClient.refetchQueries(allGroupsQueryKey);
        }
    });

    const createGroup = async () => {
        addGroup.mutate({ name: name })
        setName('')
        setOpen(false)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.currentTarget.value || '');
    }

    return (
        <div>
            <Input value={name} onInput={handleChange} placeholder="Enter group name" />
            <Button onClick={createGroup}>Save changes</Button>
        </div>
    )
}

export function GroupDataTable() {
    const [groups, groupsQuery] = trpcReact.group.getAll.useSuspenseQuery();
    const { isLoading, isError } = groupsQuery;
    const queryClient = useQueryClient();

    if (isError) return 'Error';
    if (isLoading) return 'Loading...';
  
    return (
        <DataTable
        columns={groupColumns}
        data={groups}
        isLoading={isLoading}
        />
    );
}
```

## tRPC, React Query и SSR

Проблема: при переходе на React Query, мы потеряли важное преимущество next.js - SSR. Т.к. мы используем хуки, то все наши компоненты стали клиентскими. Клиент получает страницу, а затем ждет некоторое время, чтобы получить даные на своей стороне.

Решение: комбинируем подходы и используем initialData

Серверный клиент (`serverClient.ts`):
```ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouterType } from "@server/app.router";

export const trpc = createTRPCProxyClient<AppRouterType>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
    }),
  ],
});
```

Внесем буквально пару изменений. Теперь наш с гидратацией будет принимать initialData в качестве пропсов.
```tsx
export type GroupDataTableProps = {
    initialData: RouterOutput['group']['getAll']
}

export function GroupDataTable({ initialData }: GroupDataTableProps) {
    const [groups, groupsQuery] = trpcReact.group.getAll.useSuspenseQuery(undefined, {
        initialData: initialData,
        refetchOnMount: false, // мы не хотим, чтобы пользователь запрашивал данные, которые ему уже были присланы
        refetchOnWindowFocus: false // ну а я просто не хочу перезапрашивать данные на каждое переключение окна 
    });
    const { isLoading, isError } = groupsQuery

    // ... остальная логика
}
```

А страница будет выполнять запрос на стороне сервера и формировать `initialData` еще на этапе рендеринга
```tsx
export async function GroupsPage() {
    const initData = await trpc.group.getAll.query();
    
    return (
        <main className="p-4">
            <GroupCreateDialog />
            <GroupDataTable initialData={initData} />
        </main>
    );
}
```

В этом можно убедится, если посмотреть в список запросов, которые делает пользователь. Данные есть, а запроса нет. При этом наша логика с повторным запросом данный при вставке работает.

## Шаблон

После завершения руководства я создам шаблон проекта, который можно будет установить через [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit github:yourusername/t4-stack-template my-project
```

Шаблон будет включать всю настроенную конфигурацию из этой статьи, что позволит сразу начать разработку.