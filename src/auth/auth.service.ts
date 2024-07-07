import {
    Injectable,
    UnauthorizedException,
    HttpStatus,
    HttpException
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "../user/entities/user.entity";
import { OrganizationService } from "../organization/organization.service";
import { CreateOrganizationDto } from "../organization/dto/create-organization.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly organizationService: OrganizationService
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<any> {
        const existingUser = await this.userService.findByEmail(
            registerUserDto.email
        );
        if (existingUser) {
            throw new HttpException(
                "Email already exists",
                HttpStatus.BAD_REQUEST
            );
        }

        const user = await this.userService.create(registerUserDto);

        const organizationName = `${registerUserDto.firstName}'s Organization`;
        const organizationDto: CreateOrganizationDto = {
            name: organizationName
        };
        const organization = await this.organizationService.create(
            organizationDto,
            user
        );

        user.organizations = [organization];
        await this.userService.save(user);

        // Generate JWT token
        const payload = { username: user.email, sub: user.userId };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        };
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(
            loginUserDto.email,
            loginUserDto.password
        );
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { username: user.email, sub: user.userId };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        };
    }
}
