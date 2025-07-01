// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { isOkResponse, loadResponseData } from '../../../services/utils.service';
import { TaskStatus } from '../../model/task.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgChartsModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Chart config
  public chartType: ChartType = 'doughnut';
  public doughnutLabels: string[] = ['PENDIENTE', 'EN_CURSO', 'COMPLETADA'];
  public doughnutData: ChartData<'doughnut'> = {
    labels: this.doughnutLabels,
    datasets: [ { data: [0, 0, 0] } ]
  };
  public doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%'
  };

  // Legend items (números)
  public legend = [
    { label: 'PENDIENTE',   count: 0, color: '#ffcdd2' },
    { label: 'EN_CURSO',    count: 0, color: '#f48fb1' },
    { label: 'COMPLETADA',  count: 0, color: '#e91e63' },
  ];

  constructor(private taskService: TaskService) {}

  async ngOnInit(): Promise<void> {
    const result = await this.taskService.getTasks();
    if (!Array.isArray(result) && isOkResponse(result)) {
      const tasks = loadResponseData(result) as { status: TaskStatus }[];

      // contar por estado
      const counts: Record<TaskStatus, number> = {
        PENDIENTE: 0,
        EN_CURSO:  0,
        COMPLETADA: 0
      };
      for (const t of tasks) {
        counts[t.status]++;
      }

      // actualizar datos del chart
      this.doughnutData = {
        labels: this.doughnutLabels,
        datasets: [{
          data: [
            counts.PENDIENTE,
            counts.EN_CURSO,
            counts.COMPLETADA
          ],
          backgroundColor: ['#ffcdd2','#f48fb1','#e91e63'],
          hoverBackgroundColor: ['#f8bbd0','#f06292','#d81b60']
        }]
      };

      // actualizar leyenda
      this.legend = this.legend.map(item => ({
        ...item,
        count: counts[item.label as TaskStatus]
      }));
    }
  }
}
