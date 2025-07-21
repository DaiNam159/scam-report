// src/reports/entities/report-sms.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_sms')
export class ReportSms {
  @PrimaryColumn({ type: 'int' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'varchar', length: 20 })
  phone_number: string;

  @Column({ type: 'text', nullable: true })
  sms_content: string;
}
