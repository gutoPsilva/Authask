import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ProfileDetails } from 'src/interfaces/profile.interface';
import { faCamera, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(
    private readonly profileService: ProfileService,
    private readonly alertService: AlertService,
    private readonly modalService: NgbModal
  ) {}
  info: ProfileDetails = {
    profile: {
      username: '',
      email: '',
      discordId: '',
      pfp: '',
    },
    stats: {
      totalTasks: 0,
      openTasks: 0,
      doneTasks: 0,
      inProgressTasks: 0,
      urgentTasks: 0,
    },
  };

  loadingInfo = true;
  uploadingFile = false;
  removingFile = false;

  eye = faEye;
  eyeSlash = faEyeSlash;

  showPassword = false;
  showNewPassword = false;
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_?.])[A-Za-z\\d!@#$%^&*_?.]*$';

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(this.passwordPattern),
    ]),
  });

  cameraIcon = faCamera;

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit() {
    console.log(this.passwordForm.value);

    if (this.passwordForm.valid) {
      console.log('valid form');
    }
  }

  togglePassword(field: 'password' | 'npassword', event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return;
    field === 'password'
      ? (this.showPassword = !this.showPassword)
      : (this.showNewPassword = !this.showNewPassword);
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((profile) => {
      this.info = profile;
      if (!this.info.profile.pfp) {
        // if the user doesn't have a pfp, set a default one
        this.info.profile.pfp = 'https://i.imgur.com/Gw40OZ7.jpg';
      }

      this.loadingInfo = false;
    });
  }

  onFileSelected(event: Event) {
    this.uploadingFile = true;

    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);

    // this conditional only happens if the user cancels the FIRST file selection, if the user selects a file and then cancels the next file selection, the file won't be null since the inputElement.files will still have the previous file
    if (!file) {
      this.alertService.showAlert('No file selected');
      this.uploadingFile = false;
      return;
    }

    const isImage = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
    ].includes(file?.type || '');

    if (!isImage) {
      this.alertService.showAlert(
        'Invalid file type, must be an image (png, jpg, jpeg, gif)'
      );
      this.uploadingFile = false;
      return;
    }

    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      this.alertService.showAlert('File too large, max size is 10MB');
      this.uploadingFile = false;
      return;
    }

    this.alertService.showLoadingAlert('Uploading image...');
    this.profileService.uploadImage(file).subscribe((res) => {
      this.uploadingFile = false;
      this.alertService.showLoadingAlert('');

      if (res.uploaded) {
        this.alertService.showAlert(res.message);
        this.getProfile();
      }
    });
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.removeImage();
  }

  removeImage() {
    if (this.info.profile.pfp === 'https://i.imgur.com/Gw40OZ7.jpg') {
      this.alertService.showAlert(
        "No image to remove on the server, you're currently using the default image"
      );
      return;
    }
    if (this.removingFile) return; // still processing the last request, don't send another one

    this.removingFile = true;
    this.alertService.showLoadingAlert('Removing image...');

    this.profileService.deleteImage().subscribe((res) => {
      this.removingFile = false;
      this.alertService.showLoadingAlert('');

      if (res.deleted) {
        this.alertService.showAlert(res.message);
        this.getProfile();
      }
    });
  }
}