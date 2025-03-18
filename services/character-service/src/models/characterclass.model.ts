import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Character } from './character.model';

@Entity('character_class') 
export class CharacterClass {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  // One class can be associated with many characters.
  @OneToMany(() => Character, (character) => character.characterClass)
  characters!: Character[];
}
