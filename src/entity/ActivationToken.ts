import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne
} from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity()
export class ActivationToken {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  token: string;

  @ManyToOne(type => User, user => user.activationToken, {
    onDelete: "CASCADE"
  })
  user: User;

  @Column({ type: "timestamp" })
  expires: Date;
}
