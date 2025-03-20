import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteDto {

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	entityId: string;

}