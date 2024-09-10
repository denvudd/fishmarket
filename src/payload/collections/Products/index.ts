import { admins } from '../../access/admins'
import { CollectionConfig } from 'payload/types'
import { ProductSelect } from './ui/ProductSelect'
import { checkUserPurchases } from './access/checkUserPurchases'
import { SlugField } from '../../fields/slug'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  // hooks: {
  //   beforeChange: [beforeProductChange],
  //   afterChange: [revalidateProduct],
  //   afterRead: [populateArchiveBlock],
  //   afterDelete: [deleteProductFromCarts],
  // },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...SlugField(
      {
        name: 'slug',
      },
      {
        useFields: ['title'],
      },
    ),
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            {
              name: 'stripeProductID',
              label: 'Stripe Product',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: 'priceJSON',
              label: 'Price JSON',
              type: 'textarea',
              admin: {
                readOnly: true,
                hidden: true,
                rows: 10,
              },
            },
            {
              name: 'enablePaywall',
              label: 'Enable Paywall',
              type: 'checkbox',
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'shortDesription',
      type: 'textarea',
    },
    {
      name: 'fullDescription',
      type: 'richText',
    },
    {
      name: 'weightVariants',
      type: 'array',
      required: true,
      label: 'Weight Variants',
      fields: [
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (in grams)',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Price',
          required: true,
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data }) => {
            if (!data.weight || !data.price) {
              return null
            }

            return `${data?.weight}г - ${data?.price}грн`
          },
        },
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
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

export default Products
