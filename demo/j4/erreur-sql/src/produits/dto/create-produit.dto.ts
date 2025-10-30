import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateProduitDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(3, { message: 'Le nom doit avoir au moins 3 caractères' })
  @MaxLength(255, { message: 'Le nom ne peut pas dépasser 255 caractères' })
  @Matches(/^[a-zA-Z0-9\sÀ-ÿ\-']+$/, {
    message: 'Le nom contient des caractères invalides',
  })
  nom: string;

  @IsNumber({}, { message: 'Le prix doit être un nombre' })
  @Min(0.01, { message: 'Le prix doit être au moins 0.01€' })
  @Max(999999.99, { message: 'Le prix ne peut pas dépasser 999999.99€' })
  prix: number;

  @IsInt({ message: 'La quantité doit être un nombre entier' })
  @Min(0, { message: 'La quantité ne peut pas être négative' })
  @Max(2147483647, { message: 'La quantité est trop élevée' })
  quantite: number;

  @IsString({ message: 'La catégorie doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'La catégorie ne peut pas dépasser 100 caractères' })
  @IsOptional()
  categorie?: string;
}
