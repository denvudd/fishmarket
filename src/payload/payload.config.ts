import dotenv from 'dotenv'
import path from 'path'

import type { GenerateTitle } from '@payloadcms/plugin-seo/types'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import seo from '@payloadcms/plugin-seo'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import Products from './collections/Products'
import Categories from './collections/Categories'
import Reviews from './collections/Reviews'

const generateTitle: GenerateTitle = () => {
  return 'Fishmarket'
}

const mockModulePath = path.resolve(__dirname, './emptyModuleMock.js')

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
            dotenv: path.resolve(__dirname, './dotenv.js'),
            express: mockModulePath,
          },
        },
      }
    },
  },
  editor: slateEditor({}),
  collections: [Users, Products, Categories, Reviews],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    seo({
      collections: ['products'],
      generateTitle,
    }),
    payloadCloud(),
  ],
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: ['https://checkout.stripe.com', process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(
    Boolean,
  ),
  csrf: ['https://checkout.stripe.com', process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(
    Boolean,
  ),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
