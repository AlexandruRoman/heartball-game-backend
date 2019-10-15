import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Coach {
  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public country: string;

  @Column({
    type: "varchar",
    length: 2000
  })
  public picture: string;
}

export default Coach;