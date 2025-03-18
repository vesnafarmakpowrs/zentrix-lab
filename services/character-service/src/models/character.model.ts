import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import { CharacterClass } from './characterclass.model';
  import { Item } from './item.model';
  
  @Entity('character')
  export class Character {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    name!: string;
  
    @Column('int')
    health!: number ;
  
    @Column('int')
    mana!: number;
  
    @Column('int')
    baseStrength!: number;
  
    @Column('int')
    baseAgility!: number;
  
    @Column('int')
    baseIntelligence!: number;
  
    @Column('int')
    baseFaith!: number;
  
    @ManyToOne(() => CharacterClass, (characterClass) => characterClass.characters, { eager: true })
    characterClass!: CharacterClass;
  
    // Many-to-Many relationship with Items.
    @ManyToMany(() => Item, { cascade: true, eager: true })
    @JoinTable({
      name: 'character_items',
      joinColumn: {
        name: 'character_id',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'item_id',
        referencedColumnName: 'id',
      },
    })
    items!: Item[];
  
    @Column('int')
    createdBy!: number;
  }
  