import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stats')
export class Stats {
  @Column({ type: 'int', primary: true })
  id: number;

  @Column({ type: 'int' })
  lookup_count: number;
}
