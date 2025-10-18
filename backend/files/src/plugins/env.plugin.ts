export const schema = {
  type: 'object',
  properties: {
    PORT: { type: 'string', default: 6000 }
  }
}

export const options = {
  schema: schema,
  dotenv: true,
  data: process.env
}