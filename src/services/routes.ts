// Detail screens use query parameters, not path segments, so the whole app can
// be exported as static files for the native (Capacitor) build. Records made at
// runtime — admin-created events, database rows — have ids no build could list.

const q = (value: string) => encodeURIComponent(value);

export const masjidHref = (id: string) => `/masjid?id=${q(id)}`;
export const salaahHref = (id: string) => `/masjid/salaah?id=${q(id)}`;
export const eventHref = (id: string) => `/events/view?id=${q(id)}`;
export const courseHref = (id: string) => `/learn/course?id=${q(id)}`;
export const lessonHref = (courseId: string, lessonId: string) =>
  `/learn/lesson?course=${q(courseId)}&lesson=${q(lessonId)}`;
export const classHref = (id: string) => `/learn/class?id=${q(id)}`;
export const adminEventEditHref = (id: string) => `/admin/events/edit?id=${q(id)}`;
export const adminClassEditHref = (id: string) => `/admin/classes/edit?id=${q(id)}`;
