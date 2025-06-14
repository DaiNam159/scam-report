// src/reports/entities/report-website.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_website')
export class ReportWebsite {
  @PrimaryColumn({ type: 'bigint' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  screenshot_url: string;
}
