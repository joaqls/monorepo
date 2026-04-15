import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-arbitro',
  templateUrl: './arbitro.component.html'
})
export class ArbitroComponent implements OnInit {

  partidos: any[] = [];
  clubs: any[] = [];
  arbitro: string | null = null;

  constructor(
    private partidosService: PartidosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.partidosService.obtenerClubs().subscribe({
      next: (clubs) => this.clubs = clubs,
      error: () => this.clubs = []
    });

    const usuario = this.authService.getUsuario();

    if (usuario && usuario.usuario) {
      this.arbitro = usuario.usuario;

      this.partidosService
        .obtenerPartidosPorArbitro(usuario.usuario)
        .subscribe(data => this.partidos = data);
    }
  }

  nombreClub(partido: any, side: 'local' | 'visitante'): string {
    const relation = side === 'local' ? partido?.clubLocal : partido?.clubVisitante;
    if (typeof relation?.nombre === 'string' && relation.nombre.trim() !== '') {
      return relation.nombre;
    }

    const id = Number(side === 'local' ? partido?.club_local_id : partido?.club_visitante_id);
    const match = this.clubs.find((club) => Number(club?.id) === id);
    if (typeof match?.nombre === 'string' && match.nombre.trim() !== '') {
      return match.nombre;
    }

    return side === 'local' ? 'Club local' : 'Club visitante';
  }
}