import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ProfileDetails } from 'src/interfaces/profile.interface';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(
    private readonly profileService: ProfileService,
    private readonly alertService: AlertService
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

  cameraIcon = faCamera;

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((profile) => {
      this.info = profile;
      if (!this.info.profile.pfp)
        this.info.profile.pfp =
          'https://cdn.discordapp.com/attachments/881329791658668288/881329821534201856/unknown.png';
      console.log(this.info);

      this.loadingInfo = false;
    });
  }

  onFileSelected(event: Event) {
    this.uploadingFile = true;
    this.alertService.showLoadingAlert('Uploading image...');

    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);

    const isImage = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
    ].includes(file?.type || '');

    if (!file || !isImage) {
      this.alertService.showAlert(
        'Invalid file type, must be an image (png, jpg, jpeg, gif)'
      );
      return;
    }

    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      this.alertService.showAlert('File too large, max size is 10MB');
      return;
    }

    this.profileService.uploadImage(file).subscribe((res) => {
      this.uploadingFile = false;
      this.alertService.showLoadingAlert('');

      if(res.uploaded) {
        this.alertService.showAlert(res.message);
        this.getProfile();
      }
    });
  }
}
