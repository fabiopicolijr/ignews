import { Client } from 'faunadb';

export const faunaService = new Client({
  secret: process.env.FAUNADB_KEY,
});
