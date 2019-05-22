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
export class Byte {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  body: string;

  @ManyToMany(type => Tag, { onDelete: "CASCADE" })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(type => User, author => author.bytes, { onDelete: "CASCADE" })
  author: User;

  @Column({ type: "timestamp", default: new Date() })
  created: Date;

  @Column({ type: "timestamp", default: new Date() })
  updated: Date;
}
