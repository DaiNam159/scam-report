// src/reports/entities/report-person-org.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_person_org')
export class ReportPersonOrg {
  @PrimaryColumn({ type: 'bigint' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'varchar', length: 255 })
  name: string; // Tên cá nhân hoặc tổ chức

  @Column({ type: 'varchar', length: 255, nullable: true })
  role: string; // Ví dụ: người đứng đầu, đại diện pháp luật...

  @Column({ type: 'text', nullable: true })
  identification: string; // CMND/CCCD/MST hoặc mô tả thông tin nhận dạng

  @Column({ type: 'text', nullable: true })
  address: string; // Địa chỉ cá nhân hoặc tổ chức

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone_number: string; // Số điện thoại liên hệ
  @Column({ type: 'varchar', length: 255, nullable: true })
  email_address: string; // Email liên hệ
  @Column({ type: 'text', nullable: true })
  social_links: string;

  @Column({ type: 'text', nullable: true })
  evidence: string; // Bằng chứng liên quan (có thể là mô tả hoặc đường dẫn đến file đính kèm)
}
