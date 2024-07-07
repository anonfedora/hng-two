import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    HttpException,
    HttpStatus,
    HttpCode
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";
import { RegisterResponseDto } from "./dto/register-response.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Auth")
@ApiBearerAuth("access_token")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post("register")
    @UsePipes(
        new ValidationPipe({
            exceptionFactory: errors => {
                const formattedErrors = errors.map(err => ({
                    field: err.property,
                    message: Object.values(err.constraints).join(", ")
                }));
                throw new HttpException(
                    { errors: formattedErrors },
                    HttpStatus.UNPROCESSABLE_ENTITY
                );
            }
        })
    )
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() registerUserDto: RegisterUserDto
    ): Promise<RegisterResponseDto> {
        const existingUser = await this.userService.findByEmail(
            registerUserDto.email
        );
        if (existingUser) {
            throw new HttpException(
                "Email already exists",
                HttpStatus.CONFLICT
            );
        }
        try {
            const result = await this.authService.register(registerUserDto);
            return {
                status: "success",
                message: "Registration successful",
                data: result
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: "Bad request",
                    message: "Registration unsuccessful",
                    statusCode: HttpStatus.BAD_REQUEST
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post("login")
    @UsePipes(new ValidationPipe())
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
        //return this.authService.login(loginUserDto);
        try {
            const result = await this.authService.login(loginUserDto);
            return {
                status: "success",
                message: "Login successful",
                data: result
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: "Bad request",
                    message: "Authentication failed",
                    statusCode: HttpStatus.UNAUTHORIZED
                },
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}
