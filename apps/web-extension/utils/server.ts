import { z } from "zod";

import { initTRPC } from "@calcom/trpc/server";

const t = initTRPC.create();

type User = {
  id: string;
  name: string;
};

const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
];

const appRouter = t.router({
  userById: t.procedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const { input } = req;
      const user = userList.find((u) => u.id === input);
      return user;
    }),
  userCreate: t.procedure.input(z.object({ name: z.string() })).mutation((req) => {
    const id = `${Math.random()}`;

    const user: User = {
      id,
      name: req.input.name,
    };
    userList.push(user);
    return user;
  }),
});

export type AppRouter = typeof appRouter;
