import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { OrganizationService } from "../organization/organization.service";
import { RegisterUserDto } from "../auth/dto/register-user.dto";
import { LoginUserDto } from "../auth/dto/login-user.dto";
import { User } from "../user/entities/user.entity";
import {
    HttpException,
    HttpStatus,
    UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";

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
        it("should successfully register a user", async () => {
            const registerUserDto: RegisterUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "password123",
                phone: "123456789"
            };

            const mockUser = {
                userId: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
                organizations: []
            } as User;

            jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
            jest.spyOn(userService, "create").mockResolvedValue(mockUser);
            jest.spyOn(organizationService, "create").mockResolvedValue({
                name: "John's Organization",orgId: "orgId", description: "orgDesc"
            });
            jest.spyOn(userService, "save").mockResolvedValue(mockUser);
            jest.spyOn(jwtService, "sign").mockReturnValue("fake-jwt-token");

            const result = await authService.register(registerUserDto);

            expect(result).toEqual({
                accessToken: "fake-jwt-token",
                user: {
                    userId: "1",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                    phone: "123456789"
                }
            });
        });

        it("should throw an error if email already exists", async () => {
            const registerUserDto: RegisterUserDto = {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "password123",
                phone: "123456789"
            };

            const mockUser = {
                userId: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
                organizations: []
            } as User;

            jest.spyOn(userService, "findByEmail").mockResolvedValue(mockUser);

            await expect(authService.register(registerUserDto)).rejects.toThrow(
                new HttpException(
                    "Email already exists",
                    HttpStatus.BAD_REQUEST
                )
            );
        });
    });

    describe("login", () => {
        it("should successfully log in a user", async () => {
            const loginUserDto: LoginUserDto = {
                email: "john@example.com",
                password: "password123"
            };

            const mockUser = {
                userId: "1",
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                phone: "123456789",
                password: await bcrypt.hash("password123", 10),
                organizations: []
            } as User;

            jest.spyOn(userService, "findByEmail").mockResolvedValue(mockUser);
            jest.spyOn(jwtService, "sign").mockReturnValue("fake-jwt-token");

            const result = await authService.login(loginUserDto);

            expect(result).toEqual({
                accessToken: "fake-jwt-token",
                user: {
                    userId: "1",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                    phone: "123456789"
                }
            });
        });

        it("should throw an error if credentials are invalid", async () => {
            const loginUserDto: LoginUserDto = {
                email: "john@example.com",
                password: "wrongpassword"
            };

            jest.spyOn(userService, "findByEmail").mockResolvedValue(null);

            await expect(authService.login(loginUserDto)).rejects.toThrow(
                new UnauthorizedException("Invalid credentials")
            );
        });
    });
});
