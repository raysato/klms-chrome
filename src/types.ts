export interface Plannable {
  context_type: string
  course_id: number
  plannable_id: number
  planner_override: any
  plannable_type: string
  new_activity: boolean
  submissions?: Submissions
  plannable_date: string
  plannable: Detail
  html_url: string
  context_name: string
  context_image: any
  googleTaskApiLink?: string
}

interface Submissions {
  submitted: boolean
  excused: boolean
  graded: boolean
  posted_at: any
  late: boolean
  missing: boolean
  needs_grading: boolean
  has_feedback: boolean
  redo_request: boolean
}

interface Detail {
  id: number
  title: string
  created_at: string
  updated_at: string
  points_possible: number
  due_at: string
}

export interface TaskList {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
}

export interface TaskListsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: TaskList[];
}

export interface Task {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
  parent: string;
  position: string;
  notes: string;
  status: string;
  due: string;
  completed: string;
  deleted: boolean;
  hidden: boolean;
  links: {
    type: string;
    description: string;
    link: string;
  }[];
  webViewLink: string;
}