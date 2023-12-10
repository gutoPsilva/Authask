import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { TaskService } from 'src/app/services/task/task.service';
import {
  IEDate,
  IFilters,
  ISDate,
  ITask,
  ITaskInfo,
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

  createStartDateAfterEndDate: boolean = false;
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
  }

  statusValidator(control: AbstractControl) {
    const allowedStatus = ['DONE', 'IN_PROGRESS', 'OPEN'];
    const isStatusValid = allowedStatus.includes(control.value);
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

  compareDates(start: ISDate, end: IEDate, op: 'update' | 'create') {
    const startDate = start.startDate + ' ' + start.startHour;
    const endDate = end.endDate + ' ' + end.endHour;

    if (op === 'update') this.startDateAfterEndDate = startDate > endDate;
    else this.createStartDateAfterEndDate = startDate > endDate;
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

  get createTitle() {
    return this.taskFormCreate.get('title');
  }

  get createDescription() {
    return this.taskFormCreate.get('description');
  }

  get createStatus() {
    return this.taskFormCreate.get('status');
  }

  get createUrgent() {
    return this.taskFormCreate.get('urgent');
  }

  get createStartsAt() {
    return this.taskFormCreate.get('startsAt');
  }

  get createEndsAt() {
    return this.taskFormCreate.get('endsAt');
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
    this.sortBy(this.sortBySelected);
  }

  applyFilters() {
    return this.taskList.filter((task) =>
      this.filtersSelected[task.status] ? task : null
    );
  }

  sortBy(sort: sortBy) {
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
        this.filteredTaskList.sort((a, b) => (a.endsAt >= b.endsAt ? 1 : -1));
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
    this.compareDates(
      this.taskFormUpdate.value.startsAt,
      this.taskFormUpdate.value.endsAt,
      'update'
    );

    if (this.taskFormUpdate.valid && !this.startDateAfterEndDate) this.updateTask(id);
  }

  submitCreate() {
    this.compareDates(
      this.taskFormCreate.value.startsAt,
      this.taskFormCreate.value.endsAt,
      'create'
    );

    if (this.taskFormCreate.valid && !this.createStartDateAfterEndDate) {
      this.createTask();
      this.taskFormCreate.reset();
      this.taskFormCreate.patchValue({ cStatus: 'OPEN' }); // for some reason after reseting if i don't patch this value, the radio button won't be selected
    }
  }

  createTask() {
    const startsAt = this.formatDateTime(
      this.taskFormCreate.value.startsAt.startDate,
      this.taskFormCreate.value.startsAt.startHour
    );
    const endsAt = this.formatDateTime(
      this.taskFormCreate.value.endsAt.endDate,
      this.taskFormCreate.value.endsAt.endHour
    );

    const createInfo = {
      title: this.taskFormCreate.value.title,
      description: this.taskFormCreate.value.description,
      status: this.taskFormCreate.value.status,
      urgent: this.taskFormCreate.value.urgent,
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
          this.readTasks();
          this.alertService.showLoadingAlert('');
        },
        error: (err) => {
          console.error(err);
          this.alertService.showLoadingAlert('');
        },
      });
  }

  readTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.fetchingTasks = false;
        this.taskList = tasks;
        this.filteredTaskList = this.applyFilters();
        if (this.filteredTaskList.length !== 0) this.sortBy(this.sortBySelected); // maintain the selected sort :]
      },
      error: (err) => {
        this.fetchingTasks = false;
        console.error(err);
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
          this.readTasks();
          this.alertService.showLoadingAlert('');
        },
        error: (err) => {
          console.error(err);
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
        console.error(err);
      },
    });
  }

  deleteAllTasks() {
    this.modalService.dismissAll(); // closes all open modals :]

    if (this.taskList.length > 0) {
      this.alertService.showLoadingAlert('Deleting all tasks...');

      const deleteObservables: Observable<boolean>[] = this.taskList.map(
        (task) => this.taskService.deleteTask(task.id)
      );

      forkJoin(deleteObservables).subscribe({
        // after deleting all these observables, it will execute the next function
        next: () => {
          this.readTasks();
          this.alertService.showLoadingAlert('');
        },
        error: (err) => {
          console.error(err);
          this.alertService.showLoadingAlert('');
        },
      });
    } else this.alertService.showAlert('No tasks to delete!');
  }

  searchTasks(): void {
    if (this.searchString)
      this.filteredTaskList = this.filteredTaskList.filter((task) =>
        task.title.toLowerCase().includes(this.searchString.toLowerCase())
      );
    else this.filteredTaskList = this.applyFilters();
  }
}
