import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationDto {
      @ApiProperty({ type: String, example: "Organization's Name" })
  @IsNotEmpty()
  @IsString()
  name: string;

    @ApiProperty({ type: String, example: "e.g. Tech Consultation, Cybersecurity, Digital Marketing" })
  @IsOptional()
  @IsString()
  description?: string;
}
