import { IsInt, Min, Max, IsString, Matches, IsOptional } from 'class-validator';

export class vendreProduitDTO {
    //nombre entier positif
    @IsInt()
    @Min(1)
    id: number

    //entre 1 et 100
    @IsInt()
    @Min(1)
    @Max(100)
    quantite: number

    //format : “PROMO-XXXX”
    @IsString()
    @Matches(/^(PROMO-)([A-Z0-9]{4})$/, {
        message: 'Format du code promo invalide'
    })
    @IsOptional()
    codePromo?: string
}