// This file implements a singleton pattern for the Notion client.
// A singleton pattern ensures that a class has only one instance and provides a global point of access to it.
// Here, the `notion` client is created as a single instance of the Notion SDK's Client class.
// By exporting this instance, any import of `notion` from this file will use the same Notion client instance,

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_KEY });