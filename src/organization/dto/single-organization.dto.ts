export class SingleOrganizationDto {
    status: string;
    message: string;
    data: {
        orgId: string;
        name: string;
        description: string;
    };
}
