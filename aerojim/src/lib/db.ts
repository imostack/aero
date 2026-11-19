import { neon } from "@neondatabase/serverless";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;
export type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>;

let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

function getClient(): Sql {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url) as unknown as Sql;
  }
  return client;
}

/**
 * Returns the SQL tagged-template client, making sure the schema exists first.
 * Usage: const rows = await (await db())`SELECT ...`
 */
export async function db(): Promise<Sql> {
  const sql = getClient();
  if (!schemaReady) {
    schemaReady = createSchema(sql).catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
  return sql;
}

async function createSchema(sql: Sql) {
  await sql`CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    categories TEXT[] NOT NULL DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    ref TEXT UNIQUE,
    token TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT NOT NULL,
    start_date TEXT,
    duration TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    notes TEXT,
    accepted_quote_id INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`ALTER TABLE requests ADD COLUMN IF NOT EXISTS decline_note TEXT`;

  await sql`CREATE TABLE IF NOT EXISTS request_vendors (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    sent_at TIMESTAMPTZ,
    reminded_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    available BOOLEAN,
    currency TEXT,
    day_rate DOUBLE PRECISION,
    mob_cost DOUBLE PRECISION,
    lead_time TEXT,
    valid_until TEXT,
    vendor_notes TEXT,
    UNIQUE (request_id, vendor_id)
  )`;

  await sql`CREATE TABLE IF NOT EXISTS finder_quotes (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    request_vendor_id INTEGER NOT NULL REFERENCES request_vendors(id) ON DELETE CASCADE,
    currency TEXT NOT NULL,
    day_rate DOUBLE PRECISION NOT NULL,
    mob_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
    markup_pct DOUBLE PRECISION NOT NULL,
    lead_time TEXT,
    valid_until TEXT,
    notes TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
}
