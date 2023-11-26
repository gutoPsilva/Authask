import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'password_tokens' })
export class PassTokens {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expires: Date;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @Column()
  email: string;
}
