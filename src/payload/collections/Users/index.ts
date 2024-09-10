import { CollectionConfig } from 'payload/types'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

import { adminsAndUser } from './access/adminAndUser'
import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  timestamps: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: admins,
  },
  hooks: {
    // beforeChange: [createStripeCustomer],
    afterChange: [loginAfterCreate],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'purchases',
      label: 'Purchases',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      hooks: {
        beforeChange: [resolveDuplicatePurchases],
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      admin: {
        hidden: true,
      },
      hasMany: true,
    },
    {
      label: 'Cart',
      name: 'cart',
      type: 'group',
      fields: [
        {
          name: 'items',
          label: 'Items',
          type: 'array',
          interfaceName: 'CartItems',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'quantity',
              type: 'number',
              min: 0,
              admin: {
                step: 1,
              },
            },
          ],
        },
        {
          name: 'createdOn',
          label: 'Created On',
          type: 'date',
          admin: {
            readOnly: true
          }
        },
        {
          name: 'lastModified',
          label: 'Last Modified',
          type: 'date',
          admin: {
            readOnly: true
          }
        },
      ],
    },
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
}

export default Users
