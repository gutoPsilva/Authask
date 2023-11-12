import { TaskStatus } from 'src/utils/interfaces e types/task.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LocalUser } from './LocalUser.entity';
import { DiscordUser } from './DiscordUser.entity';

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

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  endsAt: Date;

  @ManyToOne(() => LocalUser, (localUser) => localUser.tasks)
  localUser: LocalUser;

  @ManyToOne(() => DiscordUser, (discordUser) => discordUser.tasks)
  discordUser: DiscordUser;
}
