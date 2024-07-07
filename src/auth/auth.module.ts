import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "../user/user.module";
import { OrganizationModule } from "../organization/organization.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: configService.get("EXPIRES_IN") }
            }),
            inject: [ConfigService]
        }),
        PassportModule,
        UserModule,
        OrganizationModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
