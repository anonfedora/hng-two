import {
    Controller,
    Post,
    Get,
    UseGuards,
    HttpException,
    HttpStatus,
    HttpCode,
    Req,
    Body,
    Param
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { CreateOrganizationResponseDto } from "./dto/create-organization-response.dto";
import { OrganizationsDto } from "./dto/organizations.dto";
//import { UserDetailsDto } from "./dto/user-details.dto";
import { SingleOrganizationDto } from "./dto/single-organization.dto";
import { AddUserToOrganizationDto } from "./dto/add-user-to-organization.dto";
import { AddUserToOrganizationResponseDto } from "./dto/add-user-to-organization-response.dto";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Organization")
@ApiBearerAuth("access_token")
@Controller("api/organizations")
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createOrganizationDto: CreateOrganizationDto,
        @Req() req
    ): Promise<CreateOrganizationResponseDto> {
        try {
            const result = await this.organizationService.create(
                createOrganizationDto,
                req.user.sub
            );
            return {
                status: "success",
                message: "Organisation created successfully",
                data: result
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: "Bad request",
                    message: "Client error",
                    statusCode: HttpStatus.BAD_REQUEST
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getUserOrganizations(@Req() req): Promise<OrganizationsDto> {
        const organizations = await this.organizationService.findByUser(
            req.user.sub
        );
        return {
            status: "success",
            message: "Organizations retrieval successful",
            data: organizations
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get(":orgId")
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param("orgId") orgId: string
    ): Promise<SingleOrganizationDto> {
        const organization = await this.organizationService.findOne(orgId);
        return {
            status: "success",
            message: "Organization retrieved successful",
            data: organization
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post(":orgId/users")
    async addUser(
        @Body() addUserToOrganizationDto: AddUserToOrganizationDto,
        orgId: string
    ): Promise<AddUserToOrganizationResponseDto> {
        await this.organizationService.addUser(orgId, addUserToOrganizationDto);
        return {
            status: "success",
            message: "User added to organisation successfully"
        };
    }
}
