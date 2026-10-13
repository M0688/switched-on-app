import { createContext, useContext } from 'react';
import { COURSES } from '../content/courses.js';

/** The course the current screen is showing. Defaults to GCSE so existing screens behave as before. */
export const CourseContext = createContext(COURSES.gcse);
export const useCourse = () => useContext(CourseContext);
