import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
      @ApiProperty({ type: String, example: "Eleazar John" })
  @IsNotEmpty()
  @IsString()
  firstName: string;

    @ApiProperty({ type: String, example: "Doe" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

@ApiProperty({ type: String, example: "dev.mes.anonfedora@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

@ApiProperty({ type: String, example: "#1John3y24" })
  @IsNotEmpty()
  @IsString()
  password: string;

@ApiProperty({ type: String, example: "2348089739047" })
  @IsString()
  phone?: string;
}
