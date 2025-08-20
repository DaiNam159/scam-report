// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }
  async countUsers() {
    try {
      const count = await this.userRepo.count();
      return count;
    } catch (error) {
      throw new Error('Error counting users: ' + error.message);
    }
  }
  async disableUser(id: number): Promise<void> {
    try {
      await this.userRepo.update(id, { isActive: false });
    } catch (error) {
      throw new Error('Error disabling user: ' + error.message);
    }
  }
  async enableUser(id: number): Promise<void> {
    try {
      await this.userRepo.update(id, { isActive: true });
    } catch (error) {
      throw new Error('Error enabling user: ' + error.message);
    }
  }
  async updateUser(id: number, userData: UpdateUserDto): Promise<User | null> {
    try {
      await this.userRepo.update(id, userData);
      return this.userRepo.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }
  async deleteUser(id: number): Promise<void> {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    try {
      const [data, total] = await this.userRepo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'ASC' },
      });

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error: any) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }
}
