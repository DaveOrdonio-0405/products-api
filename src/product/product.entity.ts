import { Entity,Column, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description:'The unique identifier of the product'})
    id:number;

    @Column()
    @ApiProperty({description:'The name of the product'})
    name:string;

    @Column('decimal')
    @ApiProperty({description:'The description of the product'})
    price:number

    @Column()
    @ApiProperty({description:'The description of the product'})
    description:string;

}
