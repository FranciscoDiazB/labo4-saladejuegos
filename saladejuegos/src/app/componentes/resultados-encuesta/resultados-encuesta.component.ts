import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultados-encuesta',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './resultados-encuesta.component.html',
  styleUrl: './resultados-encuesta.component.scss'
})
export class ResultadosEncuestaComponent implements OnInit {

  supaBase = inject(SupabaseService);

  showAll:boolean = false;
  showLineChart:boolean = false;
  showPieChart:boolean = false;

  encuestas: any[] = [];
  lineChartData: any[] = [];
  pieChartData: any[] = [];

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#be0c0caf', '#ffe4c4', '#d2691e', '#000000']
  };

  constructor(private router:Router){

  }

  ngOnInit(): void {
    this.loadEncuestas();
  }

  async loadEncuestas() {
    const { data, error } = await this.supaBase.supabaseFunctions
      .from('survey')
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
        name: 'Edad',
        series: this.encuestas.map((e, i) => ({
          name: e.name + ' ' + e.surname,
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

  showOnlyChartLine(){
    this.showLineChart = true;
  }

  showOnlyChartPie(){
    this.showPieChart = true;
  }

  goBack(){
    this.showAll = false;
    this.showLineChart = false
    this.showPieChart = false;
  }

}
