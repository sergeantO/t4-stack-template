import * as z from "zod"

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  login: z.string(),
  password: z.string(),
})
