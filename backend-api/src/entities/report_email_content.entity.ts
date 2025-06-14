// src/reports/entities/report-email-content.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_email_content')
export class ReportEmailContent {
  @PrimaryColumn({ type: 'bigint' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'text', nullable: true })
  email_subject: string;

  @Column({ type: 'text', nullable: true })
  email_body: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sender_address: string;

  @Column({ type: 'text', nullable: true })
  attachments: string; // nên lưu dưới dạng JSON string

  @Column({ type: 'text', nullable: true })
  suspicious_links: string; // cũng nên lưu JSON string (mảng link)
}
