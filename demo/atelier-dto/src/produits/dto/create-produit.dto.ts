import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProduitDto {
  @IsString()
  nom: string;

  @IsNumber()
  prix: number;

  @IsNumber()
  quantite: number;

  @IsString()
  @IsOptional()
  categorie?: string;
}
