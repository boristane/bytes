import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Byte } from "./Byte";
import { IsEmail } from "class-validator";
import { ActivationToken } from "./ActivationToken";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  @Column({
    default: false
  })
  admin: boolean;

  @Column({
    default: false
  })
  activated: boolean;

  @OneToMany(type => Byte, byte => byte.author, { onDelete: "CASCADE" })
  bytes: Byte[];

  @OneToMany(type => ActivationToken, token => token.user, {
    onDelete: "CASCADE"
  })
  activationToken?: ActivationToken[];
}
