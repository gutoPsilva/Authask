import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiscordUser } from './DiscordUser.entity';
import { LocalUser } from './LocalUser.entity';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @OneToOne(() => LocalUser, (user) => user.pfp)
  @JoinColumn({ name: 'localUserId' }) // This will create a localUserId column in the profiles table
  localUser: LocalUser;

  @OneToOne(() => DiscordUser, (user) => user.pfp)
  @JoinColumn({ name: 'discordUserId' }) // This will create a discordUserId column in the profiles table
  discordUser: DiscordUser;
}
