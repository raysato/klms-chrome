export interface StudentData {
  ASSET_HOST: any
  active_brand_config_json_url: string
  active_brand_config: ActiveBrandConfig
  confetti_branding_enabled: boolean
  url_to_what_gets_loaded_inside_the_tinymce_editor_css: string[]
  url_for_high_contrast_tinymce_editor_css: string[]
  current_user_id: string
  current_user_global_id: string
  current_user_heap_id: string
  current_user_roles: string[]
  current_user_is_student: boolean
  current_user_types: any[]
  current_user_disabled_inbox: boolean
  current_user_visited_tabs: any
  discussions_reporting: boolean
  files_domain: string
  group_information: any
  DOMAIN_ROOT_ACCOUNT_ID: string
  DOMAIN_ROOT_ACCOUNT_UUID: string
  k12: boolean
  help_link_name: string
  help_link_icon: string
  use_high_contrast: boolean
  auto_show_cc: boolean
  disable_celebrations: boolean
  disable_keyboard_shortcuts: boolean
  LTI_LAUNCH_FRAME_ALLOWANCES: string[]
  DEEP_LINKING_POST_MESSAGE_ORIGIN: string
  DEEP_LINKING_LOGGING: any
  comment_library_suggestions_enabled: boolean
  SETTINGS: Settings
  FULL_STORY_ENABLED: boolean
  RAILS_ENVIRONMENT: string
  DIRECT_SHARE_ENABLED: boolean
  CAN_VIEW_CONTENT_SHARES: boolean
  FEATURES: Features
  current_user: CurrentUser
  page_view_update_url: string
  context_asset_string: any
  TIMEZONE: string
  CONTEXT_TIMEZONE: any
  LOCALES: string[]
  BIGEASY_LOCALE: string
  FULLCALENDAR_LOCALE: string
  MOMENT_LOCALE: string
  rce_auto_save_max_age_ms: number
  K5_USER: boolean
  USE_CLASSIC_FONT: boolean
  K5_HOMEROOM_COURSE: boolean
  K5_SUBJECT_COURSE: boolean
  LOCALE_TRANSLATION_FILE: string
  ACCOUNT_ID: string
  user_cache_key: string
  INCOMPLETE_REGISTRATION: any
  USER_EMAIL: string
  PREFERENCES: Preferences
  STUDENT_PLANNER_ENABLED: boolean
  STUDENT_PLANNER_COURSES: StudentPlannerCourses[]
  STUDENT_PLANNER_GROUPS: any[]
  ALLOW_ELEMENTARY_DASHBOARD: boolean
  CREATE_COURSES_PERMISSIONS: CreateCoursesPermissions
  OBSERVED_USERS_LIST: ObservedUsersList[]
  CAN_ADD_OBSERVEE: boolean
  notices: any[]
  active_context_tab: any
  LOCALE: string
}

export interface ActiveBrandConfig {
  md5: string
  variables: Variables
  share: boolean
  name: any
  created_at: string
  js_overrides: string
  css_overrides: string
  mobile_js_overrides: string
  mobile_css_overrides: string
  parent_md5: any
}

export interface Variables {
  "ic-brand-primary": string
  "ic-brand-global-nav-bgd": string
  "ic-brand-global-nav-ic-icon-svg-fill--active": string
  "ic-brand-global-nav-menu-item__text-color--active": string
  "ic-brand-global-nav-menu-item__badge-bgd": string
  "ic-brand-global-nav-logo-bgd": string
  "ic-brand-header-image": string
  "ic-brand-mobile-global-nav-logo": string
  "ic-brand-favicon": string
  "ic-brand-apple-touch-icon": string
  "ic-brand-msapplication-tile-square": string
  "ic-brand-msapplication-tile-wide": string
  "ic-brand-Login-body-bgd-color": string
  "ic-brand-Login-logo": string
}

export interface Settings {
  open_registration: boolean
  collapse_global_nav: boolean
  release_notes_badge_disabled: boolean
}

export interface Features {
  featured_help_links: boolean
  lti_platform_storage: boolean
  account_level_blackout_dates: boolean
  render_both_to_do_lists: boolean
  course_paces_redesign: boolean
  course_paces_for_students: boolean
  explicit_latex_typesetting: boolean
  media_links_use_attachment_id: boolean
  permanent_page_links: boolean
  differentiated_modules: boolean
  enhanced_course_creation_account_fetching: boolean
  instui_for_import_page: boolean
  enhanced_rubrics: boolean
  product_tours: boolean
  usage_rights_discussion_topics: boolean
  granular_permissions_manage_users: boolean
  create_course_subaccount_picker: boolean
  lti_deep_linking_module_index_menu_modal: boolean
  lti_dynamic_registration: boolean
  lti_multiple_assignment_deep_linking: boolean
  lti_overwrite_user_url_input_select_content_dialog: boolean
  lti_unique_tool_form_ids: boolean
  buttons_and_icons_root_account: boolean
  extended_submission_state: boolean
  scheduled_page_publication: boolean
  send_usage_metrics: boolean
  rce_transform_loaded_content: boolean
  lti_assignment_page_line_items: boolean
  mobile_offline_mode: boolean
  react_discussions_post: boolean
  instui_nav: boolean
  embedded_release_notes: boolean
  canvas_k6_theme: any
  new_math_equation_handling: boolean
}

export interface CurrentUser {
  id: string
  anonymous_id: string
  display_name: string
  avatar_image_url: string
  html_url: string
  pronouns: any
  avatar_is_fallback: boolean
}

export interface Preferences {
  dashboard_view: string
  hide_dashcard_color_overlays: any
  custom_colors: CustomColors
}

export interface CustomColors {
  user_51823: string
  course_88765: string
  course_88764: string
  course_95400: string
  course_88982: string
  course_95546: string
  course_97346: string
  course_95957: string
  course_95233: string
}

export interface StudentPlannerCourses {
  longName: string
  shortName: string
  originalName: string
  courseCode: string
  assetString: string
  href: string
  term: string
  subtitle: string
  enrollmentState: string
  enrollmentType: string
  observee: any
  id: string
  isFavorited: boolean
  isK5Subject: boolean
  isHomeroom: boolean
  useClassicFont: boolean
  canManage: boolean
  canReadAnnouncements: boolean
  image?: string
  color: any
  position: any
  published: boolean
  canChangeCoursePublishState: boolean
  defaultView: string
  pagesUrl: string
  frontPageTitle: any
}

export interface CreateCoursesPermissions {
  PERMISSION: any
  RESTRICT_TO_MCC_ACCOUNT: boolean
}

export interface ObservedUsersList {
  id: string
  name: string
  created_at: string
  sortable_name: string
  short_name: string
  avatar_url: string
}


export interface Assignment {
  id: number
  description: string
  due_at: string
  unlock_at: any
  lock_at: any
  points_possible: number
  grading_type: string
  assignment_group_id: number
  grading_standard_id: any
  created_at: string
  updated_at: string
  peer_reviews: boolean
  automatic_peer_reviews: boolean
  position: number
  grade_group_students_individually: boolean
  anonymous_peer_reviews: boolean
  group_category_id: any
  post_to_sis: boolean
  moderated_grading: boolean
  omit_from_final_grade: boolean
  intra_group_peer_reviews: boolean
  anonymous_instructor_annotations: boolean
  anonymous_grading: boolean
  graders_anonymous_to_graders: boolean
  grader_count: number
  grader_comments_visible_to_graders: boolean
  final_grader_id: any
  grader_names_visible_to_final_grader: boolean
  allowed_attempts: number
  annotatable_attachment_id: any
  hide_in_gradebook: boolean
  secure_params: string
  lti_context_id: string
  course_id: number
  name: string
  submission_types: string[]
  has_submitted_submissions: boolean
  due_date_required: boolean
  max_name_length: number
  in_closed_grading_period: boolean
  graded_submissions_exist: boolean
  is_quiz_assignment: boolean
  can_duplicate: boolean
  original_course_id: any
  original_assignment_id: any
  original_lti_resource_link_id: any
  original_assignment_name: any
  original_quiz_id: any
  workflow_state: string
  important_dates: boolean
  muted: boolean
  html_url: string
  published: boolean
  only_visible_to_overrides: boolean
  locked_for_user: boolean
  submissions_download_url: string
  post_manually: boolean
  anonymize_students: boolean
  require_lockdown_browser: boolean
  restrict_quantitative_data: boolean
}
