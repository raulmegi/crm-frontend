// src/app/dashboard/dashboard.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // <— asegúrate de incluir tu CSS
})
export class DashboardComponent {
  // renombradas para ajustar al template
  public barChartType: 'bar' = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: ['Pendientes', 'En curso', 'Completadas'],
    datasets: [
      { data: [12, 19, 7], label: 'Tareas' }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false
  };
}
