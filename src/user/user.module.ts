import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: { expiresIn: configService.get("EXPIRES_IN") }
            }),
            inject: [ConfigService]
        }),
        ConfigModule
    ],
    providers: [UserService, JwtStrategy],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
