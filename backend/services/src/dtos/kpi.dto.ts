import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EntityType } from "../enums/shared.enum";
import { IsTwoDecimalPoints } from "../util/twoDecimalPointNumber.decorator";

export class KpiDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

		@IsNotEmpty()
    @ApiProperty()
    @IsString()
    kpiUnit: string;

    @IsNotEmpty()
    @ApiProperty({ enum: EntityType })
    @IsEnum(EntityType, {
        message: "Invalid creator type. Supported following creator types:" + Object.values(EntityType),
    })
    creatorType: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    creatorId: string;

		@IsTwoDecimalPoints()
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    expected: number;
}