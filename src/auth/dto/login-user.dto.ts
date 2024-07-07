import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ type: String, example: "dev.mes.anonfedora@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
    @ApiProperty({ type: String, example: "#1John3y24" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
