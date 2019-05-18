import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Byte } from "./Byte";
import { IsEmail } from "class-validator";

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

  @Column({ type: "timestamp", default: new Date() })
  updated: Date;

  @Column({ type: "timestamp", default: new Date() })
  created: Date;

  @Column({
    default: false
  })
  admin: boolean;

  @Column({
    default: false
  })
  activated: boolean;

  @OneToMany(type => Byte, byte => byte.author)
  bytes: Byte[];
}
