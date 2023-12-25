import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './Task.entity';
import { Profile } from './Profile.entity';

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

  @OneToOne(() => Profile, (profile) => profile.discordUser)
  pfp?: Profile;
}
