import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('website_visits')
export class WebsiteVisit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  ip: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  visitedAt: Date;
}
