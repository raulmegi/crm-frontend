import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Task } from '../../model/task.model';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Task,
    @Inject(MatDialogRef) private dialogRef: MatDialogRef<TaskDetailsComponent>
  ) {}
  

  close(): void {
    this.dialogRef.close();
  }
}
