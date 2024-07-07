import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
    type: "aurora-postgres",
    url: process.env.DATABASE_URL,
    port: process.env.PORT,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: true,
    ssl: {
        rejectUnauthorized: false
    }
}));
