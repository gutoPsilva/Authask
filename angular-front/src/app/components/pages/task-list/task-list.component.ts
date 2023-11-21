import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TaskService } from 'src/app/services/task/task.service';
import { ITask, sortBy } from 'src/interfaces/tasks.interface';
import { faPlus, faCaretUp, faSpinner } from '@fortawesome/free-solid-svg-icons';

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

  addIcon = faPlus;
  loadingIcon = faSpinner;
  faCaretUp = faCaretUp;

  sortByMenu: boolean = false;
  sortBySelected: sortBy = 'Recently Added';

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.taskList = tasks;
        this.fetchingTasks = false;
        console.log(this.taskList);
      },
      error: (err) => {
        this.fetchingTasks = false;
        console.log(err);
      },
    });
  }

  toggleSortMenu(){
    this.sortByMenu = !this.sortByMenu;
  }

  sortBy(sort: sortBy) {
    this.sortBySelected = sort;
    switch (sort) {
      case 'Recently Added':
        this.taskList.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        break;
      case 'Start Date':
        this.taskList.sort((a, b) => (a.startsAt > b.startsAt ? 1 : -1));
        break;
      case 'End Date':
        this.taskList.sort((a, b) => {
          if (a.endsAt === null && b.endsAt === null) {
            return 0;
          } else if (a.endsAt === null) {
            return 1;
          } else if (b.endsAt === null) {
            return -1;
          } else {
            return a.endsAt > b.endsAt ? 1 : -1;
          }
        });
        break;
      case 'Urgent':
        this.taskList.sort((a, b) => (a.urgent > b.urgent ? 1 : -1));
        break;
    }
  }

  createTask() {}
}
