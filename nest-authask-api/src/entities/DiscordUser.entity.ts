import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './Task.entity';

@Entity({ name: 'discord_users' })
export class DiscordUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  discordId: string;

  @Column()
  username: string;

  @OneToMany(() => Task, (task) => task.discordUser)
  tasks: Task[];
}
