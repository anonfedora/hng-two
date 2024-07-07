import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    orgId: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => User, user => user.organizations)
    @JoinTable()
    users?: User[];
}
