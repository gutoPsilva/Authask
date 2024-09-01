import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocalUser } from './LocalUser.entity';
import { DiscordUser } from './DiscordUser.entity';
import { TaskStatus } from '../utils/interfaces_types/task.interface';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'OPEN', length: 11 })
  status: TaskStatus;

  @Column({ default: false })
  urgent: boolean;

  @Column() // not nullable, however the user may not provide it, and so it will be generated automatically at the instant of the registration, but he can change it later
  startsAt: Date;

  @Column() // same as startsAt
  endsAt: Date;

  @CreateDateColumn({ type: 'timestamp' }) // this one is generated automatically at the instant of the registration and cannot be changed, it just stores the moment when the task was created, and not when the task was started
  createdAt: Date;

  @ManyToOne(() => LocalUser, (localUser) => localUser.tasks)
  localUser: LocalUser;

  @ManyToOne(() => DiscordUser, (discordUser) => discordUser.tasks)
  discordUser: DiscordUser;
}
