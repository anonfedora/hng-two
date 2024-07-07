export class UserDetailsDto {
  status: string;
  message: string;
  data: {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
  };
}