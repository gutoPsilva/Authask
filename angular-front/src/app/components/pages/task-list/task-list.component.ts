import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TaskService } from 'src/app/services/task/task.service';
import {
  ICEDate,
  ICSDate,
  IFilters,
  ITask,
  ITaskInfo,
  IUEDate,
  IUSDate,
  sortBy,
} from 'src/interfaces/tasks.interface';
import {
  faPlus,
  faCaretUp,
  faSpinner,
  faTrash,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbDateStruct,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [NgbModal, NgbModalConfig],
})
export class TaskListComponent {
  constructor(
    private taskService: TaskService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  taskList: ITask[] = [];
  filteredTaskList: ITask[] = [];
  fetchingTasks: boolean = true;

  searchString: string = '';

  addIcon = faPlus;
  trashIcon = faTrash;
  loadingIcon = faSpinner;
  filterIcon = faFilter;
  faCaretUp = faCaretUp;

  cStartDateAfterEndDate: boolean = false;
  startDateAfterEndDate: boolean = false;

  sortByMenu: boolean = false;
  sortBySelected: sortBy = 'Recently Added';

  filterMenu: boolean = false;
  filtersSelected: IFilters = {
    OPEN: true,
    IN_PROGRESS: true,
    DONE: true,
  };

  model!: NgbDateStruct;
  taskFormCreate!: FormGroup;
  taskFormUpdate!: FormGroup;

  ngOnInit(): void {
    this.readTasks();

    this.taskFormUpdate = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      status: new FormControl('OPEN', [
        Validators.required,
        this.statusValidator,
      ]),
      urgent: new FormControl(false, [
        Validators.required,
        this.booleanValidator,
      ]),
      startsAt: new FormGroup({
        startDate: new FormControl('', [
          Validators.required,
          this.dateValidator,
        ]),
        startHour: new FormControl('', [
          Validators.required,
          this.hourValidator,
        ]),
      }),
      endsAt: new FormGroup({
        endDate: new FormControl('', [Validators.required, this.dateValidator]),
        endHour: new FormControl('', [Validators.required, this.hourValidator]),
      }),
    });

    this.taskFormCreate = new FormGroup({
      cTitle: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      cDescription: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      cStatus: new FormControl('OPEN', [
        Validators.required,
        this.statusValidator,
      ]),
      cUrgent: new FormControl(false, [
        Validators.required,
        this.booleanValidator,
      ]),
      cStartsAt: new FormGroup({
        cStartDate: new FormControl('', [
          Validators.required,
          this.dateValidator,
        ]),
        cStartHour: new FormControl('', [
          Validators.required,
          this.hourValidator,
        ]),
      }),
      cEndsAt: new FormGroup({
        cEndDate: new FormControl('', [
          Validators.required,
          this.dateValidator,
        ]),
        cEndHour: new FormControl('', [
          Validators.required,
          this.hourValidator,
        ]),
      }),
    });
  }

  statusValidator(control: AbstractControl) {
    const allowedStatuses = ['DONE', 'IN_PROGRESS', 'OPEN'];
    const isStatusValid = allowedStatuses.includes(control.value);
    return isStatusValid ? null : { invalidStatus: { value: control.value } };
  }

  booleanValidator(control: AbstractControl): { [key: string]: any } | null {
    const isValueBoolean = typeof control.value === 'boolean';
    return isValueBoolean ? null : { invalidBoolean: { value: control.value } };
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const datePattern =
      /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!datePattern.test(control.value)) {
      return { invalidDate: { value: control.value } };
    }

    const dateParts = control.value.split('-');
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return { invalidDate: { value: control.value } };
    }

    return null;
  }

  hourValidator(control: AbstractControl): { [key: string]: any } | null {
    const hourPattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/; // user can input seconds to match more with ISO-8601, but they won't be displayed
    const isHourValid = hourPattern.test(control.value);
    return isHourValid ? null : { invalidHour: { value: control.value } };
  }

  cCompareDates(start: ICSDate, end: ICEDate) {
    const startDate = start.cStartDate + ' ' + start.cStartHour;
    const endDate = end.cEndDate + ' ' + end.cEndHour;
    console.log(startDate, endDate);
    startDate > endDate
      ? (this.cStartDateAfterEndDate = true)
      : (this.cStartDateAfterEndDate = false);
    return startDate > endDate;
  }

  uCompareDates(start: IUSDate, end: IUEDate) {
    const startDate = start.startDate + ' ' + start.startHour;
    const endDate = end.endDate + ' ' + end.endHour;
    console.log(startDate, endDate);
    startDate > endDate
      ? (this.startDateAfterEndDate = true)
      : (this.startDateAfterEndDate = false);
    return startDate > endDate;
  }

  get title() {
    return this.taskFormUpdate.get('title');
  }

  get description() {
    return this.taskFormUpdate.get('description');
  }

  get status() {
    return this.taskFormUpdate.get('status');
  }

  get urgent() {
    return this.taskFormUpdate.get('urgent');
  }

  get startsAt() {
    return this.taskFormUpdate.get('startsAt');
  }

  get endsAt() {
    return this.taskFormUpdate.get('endsAt');
  }

  get cTitle() {
    return this.taskFormCreate.get('cTitle');
  }

  get cDescription() {
    return this.taskFormCreate.get('cDescription');
  }

  get cStatus() {
    return this.taskFormCreate.get('cStatus');
  }

  get cUrgent() {
    return this.taskFormCreate.get('cUrgent');
  }

  get cStartsAt() {
    return this.taskFormCreate.get('cStartsAt');
  }

  get cEndsAt() {
    return this.taskFormCreate.get('cEndsAt');
  }

  formatDateTime(date: string, time: string): Date {
    const fullTime = time.length === 5 ? `${time}:00` : time; // either HH:MM (5 length) or HH:MM:SS which continues with .000z already and doesn't need to add the SS
    return new Date(`${date}T${fullTime}.000Z`); // ISO-8601
  }

  toggleSortMenu() {
    this.sortByMenu = !this.sortByMenu;
  }

  toggleFilterMenu() {
    this.filterMenu = !this.filterMenu;
  }

  setFilters(filter: keyof IFilters) {
    this.filtersSelected[filter] = !this.filtersSelected[filter];
    this.filteredTaskList = this.applyFilters();
  }

  applyFilters() {
    return this.taskList.filter((task) => {
      if (this.filtersSelected[task.status]) return task;
      return;
    });
  }

  sortBy(sort: sortBy) {
    console.log(sort);
    this.sortBySelected = sort;
    switch (sort) {
      case 'Recently Added':
        this.filteredTaskList.sort((a, b) => (a.id > b.id ? -1 : 1));
        break;
      case 'Start Date':
        this.filteredTaskList.sort((a, b) =>
          a.startsAt >= b.startsAt ? 1 : -1
        );
        break;
      case 'End Date':
        this.filteredTaskList.sort((a, b) => {
          if (a.endsAt === null && b.endsAt === null) {
            return 0;
          } else if (a.endsAt === null) {
            return 1;
          } else if (b.endsAt === null) {
            return -1;
          } else {
            return a.endsAt >= b.endsAt ? 1 : -1;
          }
        });
        break;
      case 'Urgent':
        this.filteredTaskList.sort((a, b) => (a.urgent > b.urgent ? -1 : 1));
        break;
    }
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  loadUpdateFields(task: ITaskInfo) {
    console.log(task);
    this.taskFormUpdate.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      urgent: task.urgent,
      startsAt: {
        startDate: task.startsAt.toString().split('T')[0],
        startHour: task.startsAt.toString().split('T')[1].split('.')[0],
      },
      endsAt: {
        endDate: task.endsAt.toString().split('T')[0],
        endHour: task.endsAt.toString().split('T')[1].split('.')[0],
      },
    });
  }

  submitUpdate(id: number) {
    console.log(this.taskFormUpdate.value);
    const startAfterEnd = this.uCompareDates(
      this.taskFormUpdate.value.startsAt,
      this.taskFormUpdate.value.endsAt
    );

    if (this.taskFormUpdate.valid && !startAfterEnd) {
      console.log('valid');
      this.updateTask(id);
    }
  }

  submitCreate() {
    console.log(this.taskFormCreate.value);
    const startAfterEnd = this.cCompareDates(
      this.taskFormCreate.value.cStartsAt,
      this.taskFormCreate.value.cEndsAt
    );
    if (this.taskFormCreate.valid && !startAfterEnd) {
      console.log('valid');
      this.createTask();
      this.taskFormCreate.reset();
    }
  }

  createTask() {
    console.log('Creating task...');

    const startsAt = this.formatDateTime(
      this.taskFormCreate.value.cStartsAt.cStartDate,
      this.taskFormCreate.value.cStartsAt.cStartHour
    );
    const endsAt = this.formatDateTime(
      this.taskFormCreate.value.cEndsAt.cEndDate,
      this.taskFormCreate.value.cEndsAt.cEndHour
    );

    const createInfo = {
      title: this.taskFormCreate.value.cTitle,
      description: this.taskFormCreate.value.cDescription,
      status: this.taskFormCreate.value.cStatus,
      urgent: this.taskFormCreate.value.cUrgent,
    };

    this.modalService.dismissAll();
    this.alertService.showLoadingAlert('Creating task...');
    this.taskService
      .createTask({
        ...createInfo,
        startsAt,
        endsAt,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.readTasks();
          this.alertService.showLoadingAlert('');
        },
        error: (err) => {
          console.log(err);
          this.alertService.showLoadingAlert('');
        },
      });
  }

  readTasks() {
    console.log(this.taskList);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.fetchingTasks = false;
        this.taskList = tasks;
        console.log(this.taskList);
        this.filteredTaskList = this.applyFilters();
        if (this.filteredTaskList.length !== 0)
          this.sortBy(this.sortBySelected); // maintain the selected sort :]
      },
      error: (err) => {
        this.fetchingTasks = false;
        console.log(err);
      },
    });
  }

  updateTask(id: number) {
    const startsAt = this.formatDateTime(
      this.taskFormUpdate.value.startsAt.startDate,
      this.taskFormUpdate.value.startsAt.startHour
    );
    const endsAt = this.formatDateTime(
      this.taskFormUpdate.value.endsAt.endDate,
      this.taskFormUpdate.value.endsAt.endHour
    );

    this.modalService.dismissAll();
    this.alertService.showLoadingAlert('Updating task...');
    this.taskService
      .updateTask(id, { ...this.taskFormUpdate.value, startsAt, endsAt })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.readTasks();
          this.alertService.showLoadingAlert('');
        },
        error: (err) => {
          console.log(err);
          this.alertService.showLoadingAlert('');
        },
      });
  }

  deleteTask(id: number) {
    this.modalService.dismissAll(); // closes all open modals :]
    this.alertService.showLoadingAlert('Deleting task...');

    this.taskService.deleteTask(id).subscribe({
      next: (res) => {
        if (res) {
          // true means the task was deleted, so i need to update the task to display the changes
          this.readTasks();
          this.alertService.showLoadingAlert(''); // remove the alert after displaying changes
        }
      },
      error: (err) => {
        this.alertService.showLoadingAlert('');
        console.log(err);
      },
    });
    console.log('Deleting task: ' + id);
  }

  deleteAllTasks() {
    this.alertService.showLoadingAlert('Deleting all tasks...');
    this.modalService.dismissAll(); // closes all open modals :]

    const deleteObservables: Observable<boolean>[] = this.taskList.map((task) =>
      this.taskService.deleteTask(task.id)
    );

    forkJoin(deleteObservables).subscribe({
      // after deleting all these observables, it will execute the next function
      next: () => {
        console.log('all deleted');
        this.readTasks();
        this.alertService.showLoadingAlert('');
      },
      error: (err) => {
        console.error(err);
        this.alertService.showLoadingAlert('');
      },
    });
  }

  searchTasks(): void {
    if (this.searchString)
      this.filteredTaskList = this.filteredTaskList.filter((task) =>
        task.title.toLowerCase().includes(this.searchString.toLowerCase())
      );
    else this.filteredTaskList = this.applyFilters();
  }
}
