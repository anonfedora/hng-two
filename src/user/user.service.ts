import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async findOne(userId: string): Promise<User | undefined> {
        return await this.userRepository.findOneBy({userId});
    }

    /* async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }


    async remove(userId: string): Promise<void> {
        await this.usersRepository.delete(userId);
    }*/
}
