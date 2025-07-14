import { Component, Inject ,Input, Output, EventEmitter} from '@angular/core';
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
  @Output() edit = new EventEmitter<Task>();

  constructor(
  @Inject(MAT_DIALOG_DATA) public task: Task,  
  private dialogRef: MatDialogRef<TaskDetailsComponent>
) {
}

  editTask() {
    this.edit.emit(this.task);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
