import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { OrganizationService } from "../organization/organization.service";
import { RegisterUserDto } from "../auth/dto/register-user.dto";
import { LoginUserDto } from "../auth/dto/login-user.dto";
import {
    UnauthorizedException,
    HttpException,
    HttpStatus
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { User } from "../user/entities/user.entity";

describe("AuthService", () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let organizationService: OrganizationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn()
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn()
                    }
                },
                {
                    provide: OrganizationService,
                    useValue: {
                        create: jest.fn()
                    }
                }
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        organizationService =
            module.get<OrganizationService>(OrganizationService);
    });

    describe("register", () => {
        it("should register a new user and create a default organization", async () => {
            const registerUserDto: RegisterUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                phone: "1234567890"
            };

            const createdUser: User = {
                userId: "123",
                ...registerUserDto,
                organizations: [],
                organisationUsers: []
            };

            const createdOrganization = {
                orgId: "org123",
                name: "John's Organization",
                description: "",
                
            };

            jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
            jest.spyOn(userService, "create").mockResolvedValue(createdUser);
            jest.spyOn(organizationService, "create").mockResolvedValue(
                createdOrganization
            );
            jest.spyOn(userService, "save").mockResolvedValue(createdUser);
            jest.spyOn(jwtService, "sign").mockReturnValue("token123");

            const result = await authService.register(registerUserDto);

            expect(userService.findByEmail).toHaveBeenCalledWith(
                registerUserDto.email
            );
            expect(userService.create).toHaveBeenCalledWith(registerUserDto);
            expect(organizationService.create).toHaveBeenCalledWith(
                { name: "John's Organization" },
                createdUser
            );
            expect(userService.save).toHaveBeenCalledWith(createdUser);
            expect(jwtService.sign).toHaveBeenCalledWith({
                username: registerUserDto.email,
                sub: createdUser.userId
            });

            expect(result).toEqual({
                accessToken: "token123",
                user: {
                    userId: "123",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: "1234567890"
                }
            });
        });

        it("should throw an error if email already exists", async () => {
            const registerUserDto: RegisterUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
                phone: "1234567890"
            };

            jest.spyOn(userService, "findByEmail").mockResolvedValue(
                {} as User
            );

            await expect(authService.register(registerUserDto)).rejects.toThrow(
                new HttpException(
                    "Email already exists",
                    HttpStatus.BAD_REQUEST
                )
            );
        });
    });

    describe("login", () => {
        it("should return an access token and user details for valid credentials", async () => {
            const loginUserDto: LoginUserDto = {
                email: "john.doe@example.com",
                password: "password123"
            };

            const user: User = {
                userId: "123",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: await bcrypt.hash("password123", 10),
                phone: "1234567890",
                organizations: [],
                organisationUsers: []
            };

            jest.spyOn(userService, "findByEmail").mockResolvedValue(user);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
            jest.spyOn(jwtService, "sign").mockReturnValue("token123");

            const result = await authService.login(loginUserDto);

            expect(userService.findByEmail).toHaveBeenCalledWith(
                loginUserDto.email
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginUserDto.password,
                user.password
            );
            expect(jwtService.sign).toHaveBeenCalledWith({
                username: user.email,
                sub: user.userId
            });

            expect(result).toEqual({
                accessToken: "token123",
                user: {
                    userId: "123",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: "1234567890"
                }
            });
        });

        it("should throw an UnauthorizedException for invalid credentials", async () => {
            const loginUserDto: LoginUserDto = {
                email: "john.doe@example.com",
                password: "wrongpassword"
            };

            const user: User = {
                userId: "123",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: await bcrypt.hash("password123", 10),
                phone: "1234567890",
                organizations: [],
                organisationUsers: []
            };

            jest.spyOn(userService, "findByEmail").mockResolvedValue(user);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(authService.login(loginUserDto)).rejects.toThrow(
                new UnauthorizedException("Invalid credentials")
            );
        });
    });
});
