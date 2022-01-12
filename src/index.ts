import { Prisma, PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

export const prisma = new PrismaClient({
    log: [{ emit: "event", level: "query" }],
});

let LastQueryEvent: Prisma.QueryEvent | null = null;

prisma.$on("query", (event) => {
    LastQueryEvent = event;
});

prisma.$use(async (params, next) => {
    const before = process.hrtime.bigint();
    const result = await next(params);
    const after = process.hrtime.bigint();

    console.log(`...${params.action} took ${Number(after - before) / 1_000_000}ms.`);

    return result;
});

async function generateData(
    blocks: number,
    blockSize: number,
    createFunc: (params: any) => Promise<any>
) {
    for (let i = 0; i < blocks; i++) {
        const data: Prisma.StringIdModelCreateInput[] = Array.from(Array(blockSize).keys()).map(
            (key) => ({ value: nanoid() })
        );

        await createFunc({ data });
    }
}

async function truncateAllTables() {
    for (const tableName of ["StringIdModel", "IntegerIdModel", "BigIntegerIdModel"]) {
        await prisma.$executeRawUnsafe(`TRUNCATE public."${tableName}" RESTART IDENTITY CASCADE`);
    }
}

async function generateRandomData() {
    const blockSize = 1000;
    const totalBlocks = 1000;
    await truncateAllTables();
    console.log(`Generating String ID records`);
    await generateData(totalBlocks, blockSize, prisma.stringIdModel.createMany);
    console.log("Generating Integer ID records");
    await generateData(totalBlocks, blockSize, prisma.integerIdModel.createMany);
    console.log("Generating BigInt ID records");
    await generateData(totalBlocks, blockSize, prisma.bigIntegerIdModel.createMany);
}

async function test() {
    /**
     * Generate random data to fill in the datasets
     * uncomment when you need to fill tables with random data
     * comment when you only test queries
     */

    //await generateRandomData();

    const queryLimit = 5;
    const queryOffset = 950000;

    /**
     * String UUID model
     */

    console.log("--- String ID model ---");
    console.log("prisma.findMany");
    const dts1 = await prisma.stringIdModel.findMany({ skip: queryOffset, take: queryLimit });
    console.log("\nquery:");
    console.log(LastQueryEvent?.query);
    console.log("\nIDs:\n ", dts1.map((x) => x.id).join("\n  "));

    if (LastQueryEvent) {
        console.log("\nprisma.queryRaw -> generated query");
        const dts2: any[] = await prisma.$queryRawUnsafe(
            LastQueryEvent?.query,
            queryLimit,
            queryOffset
        );
        console.log("\nIDs:\n ", dts2.map((x: any) => x.id).join("\n  "));
    }

    console.log("\nprisma.queryRaw -> custom query");
    const dts3: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM public."StringIdModel" LIMIT ${queryLimit} OFFSET ${queryOffset}`
    );
    console.log("\nIDs:\n ", dts3.map((x: any) => x.id).join("\n  "));

    /**
     * Integer UUID model
     */

    console.log("--- Integer ID model ---");
    console.log("prisma.findMany");
    const dti1 = await prisma.integerIdModel.findMany({ skip: queryOffset, take: queryLimit });
    console.log("\nquery:");
    console.log(LastQueryEvent?.query);
    console.log("\nIDs:\n ", dti1.map((x) => x.id).join("\n  "));

    if (LastQueryEvent) {
        console.log("\nprisma.queryRaw -> generated query");
        const dti2: any[] = await prisma.$queryRawUnsafe(
            LastQueryEvent?.query,
            queryLimit,
            queryOffset
        );
        console.log("\nIDs:\n ", dti2.map((x: any) => x.id).join("\n  "));
    }

    console.log("\nprisma.queryRaw -> custom query");
    const dti3: any[] =
        await prisma.$queryRaw`SELECT * FROM public."IntegerIdModel" LIMIT ${queryLimit} OFFSET ${queryOffset}`;
    console.log("\nIDs:\n ", dti3.map((x: any) => x.id).join("\n  "));

    /**
     * BigInt UUID model
     */

    console.log("--- BigInt ID model ---");
    console.log("prisma.findMany");
    const dtbi1 = await prisma.bigIntegerIdModel.findMany({ skip: queryOffset, take: queryLimit });
    console.log("\nquery:");
    console.log(LastQueryEvent?.query);
    console.log("\nIDs:\n ", dti1.map((x) => x.id).join("\n  "));

    if (LastQueryEvent) {
        console.log("\nprisma.queryRaw -> generated query");
        const dtbi2: any[] = await prisma.$queryRawUnsafe(
            LastQueryEvent?.query,
            queryLimit,
            queryOffset
        );
        console.log("\nIDs:\n ", dtbi2.map((x: any) => x.id).join("\n  "));
    }

    console.log("\nprisma.queryRaw -> custom query");
    const dtbi3: any[] =
        await prisma.$queryRaw`SELECT * FROM public."BigIntegerIdModel" LIMIT ${queryLimit} OFFSET ${queryOffset}`;
    console.log("\nIDs:\n ", dti3.map((x: any) => x.id).join("\n  "));
}

test();
