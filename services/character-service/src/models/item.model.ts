import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Character } from './character.model';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('int')
  bonusStrength!: number;

  @Column('int')
  bonusAgility!: number;

  @Column('int')
  bonusIntelligence!: number;

  @Column('int')
  bonusFaith!: number;

  // Assuming an item can be held by multiple characters (and vice versa)
  @ManyToMany(() => Character, character => character.items)
  @JoinTable() // Creates the join table if not defined on the other side
  characters!: Character[];

  // Computed property that appends the highest bonus stat to the item name
  get displayName(): string {
    // Map each stat to its bonus value
    const bonusMap = {
      Strength: this.bonusStrength,
      Agility: this.bonusAgility,
      Intelligence: this.bonusIntelligence,
      Faith: this.bonusFaith,
    };

    // Determine the bonus with the highest value
    const highestBonus = Object.keys(bonusMap).reduce((prev, curr) =>
      bonusMap[prev as keyof typeof bonusMap] > bonusMap[curr as keyof typeof bonusMap] ? prev : curr
    );

    return `${this.name} of ${highestBonus}`;
  }
}
