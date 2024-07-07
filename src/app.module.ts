import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import * as path from "path";
import databaseConfig from "./config/database.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [databaseConfig],
            isGlobal: true //
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                /*type: configService.get<string>("database.type"),**/
                type: "postgres",
                url: configService.get<string>("database.url"),
                port: +configService.get<number>("database.port"),
                
                synchronize: true,
                entities: ["dist/**/*.entity.js"],
                ssl: configService.get<boolean>("database.ssl")
                    ? { rejectUnauthorized: false }
                    : false
            }),

            inject: [ConfigService]
        }),
        UserModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
