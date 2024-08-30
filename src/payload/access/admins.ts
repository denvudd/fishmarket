import type { AccessArgs } from "payload/config";

import { checkRole } from "../collections/Users/checkRole";
import type { User } from "../payload-types";

type CheckIsAdminFunction = (args: AccessArgs<unknown, User>) => boolean;

export const admins: CheckIsAdminFunction = ({ req: { user } }) => {
  return checkRole(["admin"], user);
};
