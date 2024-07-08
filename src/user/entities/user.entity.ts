import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    ManyToMany,
    OneToMany
} from "typeorm";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Organization } from "../../organization/entities/organization.entity";
import * as bcrypt from "bcryptjs";
import { OrganisationUser } from "../../organization/entities/organisation-user.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    userId: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    password: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string;

    @ManyToMany(() => Organization, organization => organization.users)
    organizations?: Organization[];

    @OneToMany(
        () => OrganisationUser,
        organisationUser => organisationUser.user
    )
    organisationUsers?: OrganisationUser[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
