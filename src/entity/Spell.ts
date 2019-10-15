import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Spell {
  @PrimaryColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({
    type: "varchar",
    length: 2000
  })
  public picture: string;

  @Column()
  public description: string;

  @Column()
  public effect: string;
}

export default Spell;