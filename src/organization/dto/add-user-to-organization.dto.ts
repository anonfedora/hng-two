import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddUserToOrganizationDto {
    @ApiProperty({
        type: String,
        example: "fa490fd7-d893-4603-b29d-8cc0ef02c73b"
    })
    @IsNotEmpty()
    userId: string;
}


