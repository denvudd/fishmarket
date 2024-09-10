import type { CollectionConfig } from 'payload/types'
import { SlugField } from '../../fields/slug'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    ...SlugField(
      {
        name: 'slug',
      },
      {
        useFields: ['title'],
      },
    ),
    {
      name: 'title',
      type: 'text',
    },
  ],
}

export default Categories
