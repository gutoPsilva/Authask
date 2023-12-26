import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ProfileDetails } from 'src/interfaces/profile.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(private readonly profileService: ProfileService) {}
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

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe((profile) => {
      this.info = profile;
      console.log(this.info);

      this.loadingInfo = false;
    });
  }
}
