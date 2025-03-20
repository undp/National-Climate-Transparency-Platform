import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class mitigationTimelineDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    activityId: string;

    @ApiProperty()
    mitigationTimeline: {
        expected: {
            baselineEmissions: number[];
            activityEmissionsWithM: number[];
            activityEmissionsWithAM: number[];
            expectedEmissionReductWithM: number[];
            expectedEmissionReductWithAM: number[];
            total: {
                baselineEmissions:number;
                activityEmissionsWithM:number;
                activityEmissionsWithAM:number;
                expectedEmissionReductWithM:number;
                expectedEmissionReductWithAM:number;
            };
        };
        actual: {
            baselineActualEmissions: number[];
            activityActualEmissions: number[];
            actualEmissionReduct: number[];
            total: {
                baselineActualEmissions: number;
                activityActualEmissions: number;
                actualEmissionReduct: number;
            };
        };
    }

    @IsNotEmpty()
    @IsNumber()
	@ApiProperty()
	achievedGHGReduction: number;

    @IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	expectedGHGReduction: number;
}