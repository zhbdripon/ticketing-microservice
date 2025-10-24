import { ValidationError } from "../errors";
import { z } from "zod";

const RequestUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(20),
});

export const authReqValidation = (req: any, res: any, next: any) => {
  const parsedData = RequestUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ValidationError(parsedData.error);
  }

  next();
};
