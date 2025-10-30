// === DTO DE CRÉATION CLIENT (AVEC VALIDATION) ===
import {
    IsString,
    IsEmail,
    IsNumber,
    IsOptional,
    MinLength,
    MaxLength,
    Min,
} from 'class-validator';
export class CreateClientDto {
    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    @MinLength(2, { message: 'Le nom doit avoir au moins 2 caractères' })
    @MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
    nom: string;
    @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
    @MinLength(2, { message: 'Le prénom doit avoir au moins 2 caractères' })
    @MaxLength(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' })
    prenom: string;
    @IsEmail({}, { message: 'L\'email doit être valide' })
    email: string;
    @IsNumber({}, { message: 'Le solde initial doit être un nombre' })
    @Min(0, { message: 'Le solde initial ne peut pas être négatif' })
    @IsOptional()
    soldeInitial?: number;
}