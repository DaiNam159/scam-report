// src/reports/entities/report-social.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_social')
export class ReportSocial {
  @PrimaryColumn({ type: 'bigint' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'varchar', length: 100 })
  platform: string; // Ví dụ: Facebook, Instagram, Zalo...

  @Column({ type: 'text', nullable: true })
  profile_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;
}
