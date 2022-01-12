# prisma-performance-test

This repo is to reproduce a possible bug/issue in prisma when executing queries against postgres database.
The essence of the problem is that queries (select) executed via prisma are way slower compared to similar queries executed directly.

## Running the test
1. Clone the repo
2. Create `.env` file in the project folder and put prisma DB url there. [Check this guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql#connection-url) to see more. The environment variable name is `PRISMA_DB_URL`
3. Install dependencies (`npm i` or `yarn`)
4. Generate prisma client (`yarn prisma generate`)
5. If you are running for the first time, open `src/index.ts` and uncomment the following line `//await generateRandomData();`. This will generate random data to execute queries. When running again, comment if you don't want to regenerate the data each time.
6. Run the test `yarn start`

## Results
Once data is generated the app will execute queries using two methods. 

First method is regular for prisma and uses `prisma.<model>.findMany({skip, take})`. The other method uses `prisma.queryRaw` to execute a manually prepared query to fetch the data. 

The results will be shown in your terminal and will look similar to this
```
--- String ID model ---
...findMany took 7912.291291ms.
...queryRaw took 58.426263ms.
--- Integer ID model ---
...findMany took 4634.006016ms.
...queryRaw took 63.228109ms.
--- BigInt ID model ---
...findMany took 5655.618795ms.
...queryRaw took 50.090437ms.
```

## Interpretation
Provided that models are intentionally very simple and have no relation or complex data, it is absolutely confusing why query time is so much different. 