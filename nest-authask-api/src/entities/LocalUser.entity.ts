import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './Task.entity';
import { Profile } from './Profile.entity';

@Entity({ name: 'local_users' })
export class LocalUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    unique: true,
    charset: 'utf8mb4',
    collation: 'utf8mb4_bin', // case sensitive
  })
  username: string;

  @Column({ unique: true, charset: 'utf8mb4', collation: 'utf8mb4_bin' })
  email: string;

  @Column({ length: 60 })
  password: string; // hash will return 60 chars

  @OneToMany(() => Task, (task) => task.localUser)
  tasks: Task[];

  @OneToOne(() => Profile, (profile) => profile.localUser)
  pfp?: Profile;
}
