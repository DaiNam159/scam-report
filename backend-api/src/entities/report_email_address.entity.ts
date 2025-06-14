// src/reports/entities/report-email.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_email_address')
export class ReportEmailAddress {
  @PrimaryColumn({ type: 'bigint' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'varchar', length: 255 })
  email_address: string;

  @Column({ type: 'text', nullable: true })
  reason: string; // lý do nghi ngờ
}
