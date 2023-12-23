
export interface IProject {
  id: string;
  name: string;
  description: string;
}

export interface ITask {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  parentTaskId: string;
  plannedHours: number;
}


