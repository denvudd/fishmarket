import type { Access, AccessArgs } from "payload/config";

import { checkRole } from "../collections/Users/checkRole";
import type { User } from "../payload-types";

type CheckIsAdminFunction = (args: AccessArgs<unknown, User>) => boolean;

export const adminsOrLoggedIn: CheckIsAdminFunction = ({ req }: AccessArgs<unknown, User>) => {
  if (checkRole(["admin"], req.user)) {
    return true;
  }

  return !!req.user;
};
