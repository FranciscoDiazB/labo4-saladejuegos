import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultados-encuesta',
  imports: [],
  templateUrl: './resultados-encuesta.component.html',
  styleUrl: './resultados-encuesta.component.scss'
})
export class ResultadosEncuestaComponent implements OnInit {

  supaBase = inject(SupabaseService);

  showAll:boolean = false;

  encuestas: any[] = [];
  lineChartData: any[] = [];
  pieChartData: any[] = [];

  constructor(private router:Router){

  }

  ngOnInit(): void {
    
  }

  async loadEncuestas() {
    const { data, error } = await this.supaBase.supabaseFunctions
      .from('encuestas')
      .select('*');

    if (error) {
      console.error(error);
      return;
    }

    // Procesar géneros
    this.encuestas = data.map(item => {
      const genresObj = JSON.parse(item.genres);

      const generosTrue = Object.keys(genresObj).filter(key => genresObj[key]);

      return {
        ...item,
        generosTrue
      };
    });

    this.prepareLineChart();
    this.preparePieChart();
  }

  // 📊 Gráfico LINEAL (edad)
  prepareLineChart() {
    this.lineChartData = [
      {
        name: 'Edades',
        series: this.encuestas.map((e, i) => ({
          name: `Persona ${i + 1}`,
          value: e.age
        }))
      }
    ];
  }

  // 🥧 Gráfico TORTA (minutesPlayed)
  preparePieChart() {
    const counter: Record<string, number> = {};

    this.encuestas.forEach(e => {
      counter[e.minutesPlayed] = (counter[e.minutesPlayed] || 0) + 1;
    });

    this.pieChartData = Object.keys(counter).map(key => ({
      name: key,
      value: counter[key]
    }));
  }

  showAllSurveys(){
    this.showAll = true;
  }

  goBack(){
    this.showAll = false;
  }

}
