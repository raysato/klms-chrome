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
