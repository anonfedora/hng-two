import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { Organization } from "./entities/organization.entity";
import { OrganisationUser } from "./entities/organisation-user.entity";
import { OrganizationsDto } from "./dto/organizations.dto";
import { AddUserToOrganizationDto } from "./dto/add-user-to-organization.dto";
import { User } from "../user/entities/user.entity";

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(OrganisationUser)
        private organisationUserRepository: Repository<OrganisationUser>
    ) {}

    create(
        createOrganizationDto: CreateOrganizationDto,
        user: User
    ): Promise<Organization> {
        const organization = this.organizationRepository.create(
            createOrganizationDto
        );
        organization.users = [user];
        return this.organizationRepository.save(organization);
    }

    async findByUser(userId: string): Promise<any> {
        return this.organizationRepository
            .createQueryBuilder("organization")
            .leftJoinAndSelect("organization.users", "user")
            .where("user.userId = :userId", { userId })
            .getMany();
    }

    async findOne(orgId: string): Promise<Organization> {
        return await this.organizationRepository.findOneBy({ orgId });
    }

    async addUser(
        orgId: string,
        addUserToOrganisationDto: AddUserToOrganizationDto
    ) {
        /*return await this.organizationRepository.create({ users: userId });*/
        const { userId } = addUserToOrganisationDto;

        const organization = await this.organizationRepository.findOneBy({
            orgId
        });
        if (!organization) {
            throw new NotFoundException("Organisation not found");
        }

        const user = await this.userRepository.findOneBy({ userId });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const organisationUser = new OrganisationUser();
        organisationUser.organization = organization;
        organisationUser.user = user;

        await this.organisationUserRepository.save(organisationUser);
    }
}
