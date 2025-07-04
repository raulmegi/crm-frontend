import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { isOkResponse, loadResponseData } from '../../../../services/utils.service';
import { Task } from '../../../model/task.model';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { AuthService } from '../../../../services/auth.service';
import { AppUser } from '../../../model/appUser.model';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardComponent, NgChartsModule, HeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  counts = {
    pendiente: 0,
    enCurso: 0,
    completada: 0,
    vencidas: 0
  };
  today = new Date();
  isCheckingLogin = false;
  currentUser: AppUser | null = null;
  
  
  constructor(private taskService: TaskService, private authService: AuthService) {}

 async ngOnInit(): Promise<void> {
  try {
    this.currentUser = await this.authService.getLoggedUser();
    console.log('HomePage currentUser:', this.currentUser);
  } catch (error) {
    console.warn('No logged-in user');
    this.currentUser = null;
  } finally {
    this.isCheckingLogin = false;
  }
  await this.loadCounts();
}


  private async loadCounts() {
    const resp = await this.taskService.getTasks();
    if (!isOkResponse(resp)) return;
    const tasks = loadResponseData(resp) as Task[];

    this.counts.pendiente  = tasks.filter(t => t.status === 'PENDIENTE').length;
    this.counts.enCurso    = tasks.filter(t => t.status === 'EN_CURSO').length;
    this.counts.completada = tasks.filter(t => t.status === 'COMPLETADA').length;
    // vencidas = fecha fin pasada y aún no completada
    this.counts.vencidas   = tasks
      .filter(t => t.endDate && new Date(t.endDate) < this.today && t.status !== 'COMPLETADA')
      .length;
  }
}