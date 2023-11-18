import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TaskService } from 'src/app/services/task/task.service';
import { ITask } from 'src/interfaces/tasks.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  constructor(
    private taskService: TaskService,
    private alertService: AlertService
  ) {}
  taskList: ITask[] = [];
  fetchingTasks: boolean = true;

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.taskList = tasks;
        this.fetchingTasks =  false;
        console.log(this.taskList);
      },
      error: (err) => {
        this.fetchingTasks = false;
        console.log(err);
      },
    });
  }
}
