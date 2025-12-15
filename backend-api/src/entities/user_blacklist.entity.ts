import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum BlockType {
  USER = 'USER',
  IP = 'IP',
  USER_IP = 'USER_IP',
}

@Entity('user_blacklists')
export class UserBlacklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_ip: string | null;

  @Column({
    type: 'enum',
    enum: BlockType,
    nullable: false,
  })
  block_type: BlockType;

  @Column({ type: 'boolean', default: false })
  isAdminBlock: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null;

  @Column({ type: 'int', nullable: true })
  blocked_by_admin_id: number | null;
}
