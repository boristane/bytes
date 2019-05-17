import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Byte } from "./Byte";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: "timestamp", default: new Date() })
  last_updated: Date;

  @Column({
    default: false
  })
  admin: boolean;

  @OneToMany(type => Byte, byte => byte.author)
  bytes: Byte[];
}
