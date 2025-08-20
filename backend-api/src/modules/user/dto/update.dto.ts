// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

import { Optional } from '@nestjs/common';
import { IsInt, IsString } from 'class-validator';

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   password: string;

//   @Column({ nullable: true })
//   fullName: string;

//   @Column({ default: false })
//   isAdmin: boolean;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
export class UpdateUserDto {
  @IsString()
  email: string;
  @IsString()
  fullName: string;
  @Optional()
  password?: string;
}
