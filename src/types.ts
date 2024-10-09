export interface Todo {
  id: string;
  userId: string;
  task: string;
  completed: boolean;
  date?: Date;
  location?: string;
  people?: string;
}