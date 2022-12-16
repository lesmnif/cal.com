import { createTRPCReact } from "@calcom/trpc/react";

import type { AppRouter } from "./server";

export const trpc = createTRPCReact<AppRouter>();
