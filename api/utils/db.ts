import pg from 'pg';

export const query = async (query: string, values: any[] = []): Promise<pg.QueryResult<any>> => {
  const {Client} = pg;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query(query, values);
  await client.end();
  return res;
}

export const dbUpdateAccountAmount = async (amount: number, accountID: string) => {
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }
}