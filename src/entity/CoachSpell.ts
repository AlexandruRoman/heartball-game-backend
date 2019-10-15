import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CoachSpell {
  @PrimaryColumn()
  public id: number;

  @Column()
  public nameSpell: string;

  @Column()
  public description: string;

  @Column()
  public effect: string;
}

export default CoachSpell;