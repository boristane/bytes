import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created?: Date;
}
