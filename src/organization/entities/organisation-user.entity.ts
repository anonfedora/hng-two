import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Organization } from "./organization.entity";

@Entity()
export class OrganisationUser {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.organizations)
    user: User;

    @ManyToOne(
        () => Organization,
        organisation => organisation.users
    )
    organization?: Organization;
}
