import { create } from 'zustand';
import type { Rating } from '../types';

interface FilmFormData {
  title: string;
  description: string;
  image_path: string;
  release_year: number | undefined;
  rating: Rating;
}

interface FilmFormErrors {
  title?: string;
  rating?: string;
  release_year?: string;
}

interface FilmFormStore extends FilmFormData {
  errors: FilmFormErrors;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setImagePath: (value: string) => void;
  setReleaseYear: (value: number | undefined) => void;
  setRating: (value: Rating) => void;
  validate: () => boolean;
  reset: (data?: Partial<FilmFormData>) => void;
}

const defaultValues: FilmFormData = {
  title: '',
  description: '',
  image_path: '',
  release_year: undefined,
  rating: 'G',
};

export const useFilmFormStore = create<FilmFormStore>((set, get) => ({
  ...defaultValues,
  errors: {},
  
  setTitle: (value) => set({ title: value, errors: { ...get().errors, title: undefined } }),
  setDescription: (value) => set({ description: value }),
  setImagePath: (value) => set({ image_path: value }),
  setReleaseYear: (value) => set({ release_year: value, errors: { ...get().errors, release_year: undefined } }),
  setRating: (value) => set({ rating: value }),
  
  validate: () => {
    const { title, release_year } = get();
    const errors: FilmFormErrors = {};
    
    if (!title || title.trim().length === 0) {
      errors.title = 'Title is required';
    }
    
    if (release_year !== undefined) {
      if (release_year < 1800 || release_year > 2100) {
        errors.release_year = 'Release year must be between 1800 and 2100';
      }
    }
    
    set({ errors });
    return Object.keys(errors).length === 0;
  },
  
  reset: (data) => set({ ...defaultValues, ...data, errors: {} }),
}));
