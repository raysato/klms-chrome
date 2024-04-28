import { Assignment, StudentData } from './types'

function injectScript (src: string) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.type = "module" // <-- Add this line for ESM module support
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}
document.addEventListener("variableRetrieved", (e: any) => {
    retrievedValues(e.detail)
});

injectScript('src/inject.js')

function retrievedValues (data: StudentData) {
    console.log({data})
    const courses = data.STUDENT_PLANNER_COURSES
    chrome.storage.local.set({ "klmsToolsCourses": courses });
    console.log('course', courses)
    const assignments = courses.map(async course => {
        try {
          const response = await fetch(`https://lms.keio.jp/api/v1/courses/${course.id}/assignments`);
          return await response.json();
        } catch (error) {
          console.error("Error creating assignment for course:", course.shortName, error);
          // Handle the error appropriately (e.g., retry, log to a file)
        }
    });
      
    Promise.all(assignments)
        .then(async resolvedAssignments => {
          console.log("All assignments created successfully:", resolvedAssignments);
          const mashed = resolvedAssignments.reduce((carry, val) => [...carry, ...val])
          const sorted: Assignment[] = mashed.sort((a: Assignment, b: Assignment) => a.due_at.localeCompare(b.due_at))
          console.log({sorted})
          chrome.storage.local.set({ "klmsToolsAssignments": sorted });
          console.log('storage', (await chrome.storage.local.get(['klmsToolsAssignments'])).klmsToolsAssignments)
        })
        .catch(error => {
          console.error("An error occurred while creating assignments:", error);
        });
}