export class LoginResponseDto {
  status: string;
  message: string;
  data: {
    accessToken: string;
    user: {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };
}