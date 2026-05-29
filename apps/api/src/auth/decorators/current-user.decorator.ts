import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import type { JwtUser } from "../auth.types";

type RequestWithUser = Request & { user?: JwtUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
