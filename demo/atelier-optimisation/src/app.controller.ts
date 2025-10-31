import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly db: DatabaseService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('info')
  getInfo(): object {
    return this.appService.getInfo();
  }

  @Get('stats')
  async getGlobalStats() {
    // Exécuter toutes les requêtes en parallèle pour optimiser
    const [
      produitsStats,
      clientsStats,
      reservationsStats,
      caStats,
    ] = await Promise.all([
      // Stats produits
      this.db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(quantite) as quantite_totale,
          SUM(prix * quantite) as valeur_totale,
          AVG(prix) as prix_moyen
        FROM produits
      `),
      
      // Stats clients
      this.db.query(`
        SELECT 
          COUNT(*) as total,
          SUM(solde) as solde_total,
          AVG(solde) as solde_moyen
        FROM clients
      `),
      
      // Stats réservations
      this.db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN statut = 'confirmee' THEN 1 END) as confirmees,
          COUNT(CASE WHEN statut = 'annulee' THEN 1 END) as annulees
        FROM reservations
      `),
      
      // CA par mois
      this.db.query(`
        SELECT 
          DATE_FORMAT(date_reservation, '%Y-%m') as mois,
          SUM(montant_total) as ca,
          COUNT(*) as nb_reservations
        FROM reservations
        WHERE statut = 'confirmee'
        GROUP BY mois
        ORDER BY mois DESC
        LIMIT 12
      `),
    ]);

    return {
      succes: true,
      data: {
        produits: {
          total: Number(produitsStats[0].total),
          quantiteTotale: Number(produitsStats[0].quantite_totale) || 0,
          valeurTotale: Number(produitsStats[0].valeur_totale) || 0,
          prixMoyen: Number(produitsStats[0].prix_moyen) || 0,
        },
        clients: {
          total: Number(clientsStats[0].total),
          soldeTotal: Number(clientsStats[0].solde_total) || 0,
          soldeMoyen: Number(clientsStats[0].solde_moyen) || 0,
        },
        reservations: {
          total: Number(reservationsStats[0].total),
          confirmees: Number(reservationsStats[0].confirmees),
          annulees: Number(reservationsStats[0].annulees),
        },
        chiffreAffaires: caStats,
      },
    };
  }
}