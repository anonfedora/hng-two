import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    HttpException,
    HttpStatus,
    HttpCode,
    UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDetailsDto } from "./dto/user-details.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("User")
@ApiBearerAuth("access_token")
@Controller("api/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
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
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":userId")
    @HttpCode(HttpStatus.OK)
    async findOne(@Param("userId") userId: string): Promise<UserDetailsDto> {
        try {
            const user = await this.userService.findOne(userId);
            return {
                status: "success",
                message: "User retrieved successfully",
                data: user
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: "Not found",
                    message: "User not found",
                    statusCode: HttpStatus.NOT_FOUND
                },
                HttpStatus.NOT_FOUND
            );
        }
    }

    /*@Get()
    async findAll() {
        return await this.userService.findAll();
    }


    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.userService.remove(id);
    }*/
}
