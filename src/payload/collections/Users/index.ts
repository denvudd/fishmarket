import { CollectionConfig } from "payload/types";

import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";
import adminsAndUser from './access/adminAndUser'
import { admins } from "../../access/admins";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  timestamps: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      defaultValue: ["customer"],
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "customer",
          value: "customer",
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: adminsAndUser,
        create: admins,
        update: admins,
      },
    },
    {
      name: "skipSync",
      label: "Skip Sync",
      type: "checkbox",
      admin: {
        position: "sidebar",
        readOnly: true,
        hidden: true,
      },
    },
  ],
};

export default Users;
