import { IsInt } from 'class-validator';

export class EditStatusDto {
  @IsInt()
  id: number;
}
