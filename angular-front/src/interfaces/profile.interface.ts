export interface ProfileDetails {
  profile: {
    username: string;
    email?: string; // only exists if the user is local
    discordId?: string; // only exists if the user is from discord
    pfp?: string; // only exists if a image file was uploaded on the server
  };
  stats: {
    totalTasks: number;
    openTasks: number;
    doneTasks: number;
    inProgressTasks: number;
    urgentTasks: number;
  };
}

export interface UploadResponse {
  message: string;
  uploaded: boolean;
}
