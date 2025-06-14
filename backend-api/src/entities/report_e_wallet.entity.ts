// src/reports/entities/report-e-wallet.entity.ts

import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Report } from './reports.entity';

@Entity('report_e_wallet')
export class ReportEWallet {
  @PrimaryColumn({ type: 'bigint' })
  report_id: number;

  @OneToOne(() => Report, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @Column({ type: 'varchar', length: 100 })
  wallet_type: string; // Ví dụ: Momo, ZaloPay, ShopeePay...

  @Column({ type: 'varchar', length: 100 })
  wallet_id: string; // Ví dụ: số điện thoại hoặc mã ví

  @Column({ type: 'varchar', length: 255, nullable: true })
  account_holder_name: string;
}
