import { Module } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entities/organization.entity";
import { OrganisationUser } from "./entities/organisation-user.entity";
import { User } from "../user/entities/user.entity";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([Organization, OrganisationUser, User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: configService.get("EXPIRES_IN") }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [OrganizationController],
    providers: [OrganizationService, JwtStrategy],
    exports: [OrganizationService]
})
export class OrganizationModule {}
