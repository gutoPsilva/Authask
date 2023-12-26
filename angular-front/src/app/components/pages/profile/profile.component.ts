import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ProfileDetails } from 'src/interfaces/profile.interface';
import { faCamera, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(
    private readonly profileService: ProfileService,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly modalService: NgbModal
  ) {}
  // starts empty but ngOnInit will fill these properties
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

  // control properties to enable/disable buttons & etc
  loadingInfo = true;
  uploadingFile = false;
  removingFile = false;
  changingPassword = false;

  // icons
  cameraIcon = faCamera;
  eye = faEye;
  eyeSlash = faEyeSlash;

  // form stuff
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

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { newPassword, password } = this.passwordForm.value;

      // TS keeps complaining about the passwords being null, but they're not since the forms is valid
      if (!newPassword || !password) {
        this.alertService.showAlert('No Password or New Password provided');
        return;
      }

      this.changingPassword = true;

      this.modalService.dismissAll();
      this.alertService.showLoadingAlert('Updating password...');
      this.authService.updatePassword({ password, newPassword }).subscribe({
        next: (res) => {
          this.alertService.showAlert(res.message);
          this.alertService.showLoadingAlert('');
          this.changingPassword = false;
          this.passwordForm.reset();
        },
        error: (err) => {
          this.alertService.showAlert(err.error.message);
          this.alertService.showLoadingAlert('');
          this.changingPassword = false;
          this.passwordForm.reset();
        },
      });
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
      this.removingFile = false; // this was necessary to avoid multiple requests when the user removes the image but the new pfp property wasn't still set
    });
  }

  onFileSelected(event: Event) {
    this.uploadingFile = true;
    console.log(event);

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

      if (event.target instanceof HTMLInputElement) {
        event.target.value = ''; // this is necessary to allow the user to upload the same file again after removing it
      }
    });
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.uploadingFile) return; // still processing the last request, don't send another one
    if (event.key === 'Enter') this.removeImage();
  }

  removeImage() {
    if (this.removingFile) {
      return; // still processing the last request, don't send another one
    }

    if (this.info.profile.pfp === 'https://i.imgur.com/Gw40OZ7.jpg') {
      this.alertService.showAlert(
        "No image to remove on the server, you're currently using the default pfp"
      );
      return;
    }

    this.removingFile = true;

    this.alertService.showLoadingAlert('Removing image...');
    this.profileService.deleteImage().subscribe((res) => {
      this.alertService.showLoadingAlert('');
      if (res.deleted) {
        this.alertService.showAlert(res.message);
        this.getProfile();
      }
    });
  }
}
