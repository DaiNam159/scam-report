import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { ReportEmailAddress } from './report_email_address.entity';
import { ReportEmailContent } from './report_email_content.entity';
import { ReportWebsite } from './report_website.entity';
import { ReportPhone } from './report_phone.entity';
import { ReportSms } from './report_sms.entity';
import { ReportSocial } from './report_social.entity';
import { ReportPersonOrg } from './report_person_org.entity';
import { ReportBankAccount } from './report_bank_account.entity';
import { ReportEWallet } from './report_e_wallet.entity';

export enum ReportType {
  EMAIL_CONTENT = 'email_content',
  EMAIL_ADDRESS = 'email_address',
  PHONE = 'phone',
  SMS = 'sms',
  WEBSITE = 'website',
  SOCIAL = 'social',
  BANK_ACCOUNT = 'bank_account',
  E_WALLET = 'e_wallet',
  PERSON_ORG = 'person_org',
}

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  report_type: ReportType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  evidence: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  evidence_public_id: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  user_ip: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  contact: string;

  @OneToOne(() => ReportEmailAddress, (email) => email.report)
  email_address: ReportEmailAddress;

  @OneToOne(() => ReportEmailContent, (emailContent) => emailContent.report)
  email_content: ReportEmailContent;

  @OneToOne(() => ReportWebsite, (website) => website.report)
  website: ReportWebsite;

  @OneToOne(() => ReportPhone, (phone) => phone.report)
  phone: ReportPhone;

  @OneToOne(() => ReportSms, (sms) => sms.report)
  sms: ReportSms;

  @OneToOne(() => ReportSocial, (social) => social.report)
  social: ReportSocial;

  @OneToOne(() => ReportPersonOrg, (po) => po.report)
  person_org: ReportPersonOrg;

  @OneToOne(() => ReportBankAccount, (bank) => bank.report)
  bank_account: ReportBankAccount;

  @OneToOne(() => ReportEWallet, (wallet) => wallet.report)
  e_wallet: ReportEWallet;
}
