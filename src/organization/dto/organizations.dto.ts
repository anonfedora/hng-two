export class OrganizationsDto {
    status: string;
    message: string;
    data: {
        organisations: [{ orgId: string; name: string; description: string }];
    };
}
