// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../../entities/user.entity';
import { Between, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UserBlacklist } from './../../entities/user_blacklist.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserBlacklist)
    private blacklistRepo: Repository<UserBlacklist>,
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
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filters: any = {},
  ) {
    try {
      const qb = this.userRepo.createQueryBuilder('user');

      // Search theo email hoặc tên
      if (filters.search) {
        qb.andWhere('(user.email LIKE :search OR user.fullName LIKE :search)', {
          search: `%${filters.search}%`,
        });
      }

      // Trạng thái hoạt động
      if (filters.isActive !== undefined) {
        qb.andWhere('user.isActive = :isActive', {
          isActive: filters.isActive,
        });
      }

      // Lọc theo ngày tạo
      if (filters.dateFrom) {
        qb.andWhere('user.createdAt >= :dateFrom', {
          dateFrom: filters.dateFrom,
        });
      }
      if (filters.dateTo) {
        qb.andWhere('user.createdAt <= :dateTo', { dateTo: filters.dateTo });
      }

      // Sort
      if (sortBy) {
        qb.orderBy(`user.${sortBy}`, sortOrder);
      }

      // Pagination
      qb.skip((page - 1) * limit).take(limit);

      const [data, total] = await qb.getManyAndCount();

      return { data, total, page, limit };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }
  async getRegisterToday() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const count = await this.userRepo.count({
        where: {
          createdAt: Between(today, tomorrow),
        },
      });
      return count;
    } catch (error) {
      throw new Error(`Error fetching today's registrations: ${error.message}`);
    }
  }

  async BanUsers(dto: BanUserDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      user.isBanned = true;
      user.banReason = dto.reason;
      user.isActive = false;
      await this.userRepo.save(user);
    } catch (error) {
      throw new Error(`Error fetching spam users: ${error.message}`);
    }
  }

  async getBannedUsers() {
    try {
      const bannedUsers = await this.userRepo.find({
        where: { isBanned: true },
      });

      return bannedUsers;
    } catch (error) {
      throw new Error(`Error fetching banned users: ${error.message}`);
    }
  }

  async unbanUser(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      user.isBanned = false;
      user.banReason = '';
      user.isActive = true;
      await this.userRepo.save(user);
      return { message: 'User unbanned successfully' };
    } catch (error) {
      throw new Error(`Error unbanning user: ${error.message}`);
    }
  }
}
