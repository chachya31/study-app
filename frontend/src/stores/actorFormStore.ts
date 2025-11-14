import { create } from 'zustand';

interface ActorFormData {
  first_name: string;
  last_name: string;
}

interface ActorFormErrors {
  first_name?: string;
  last_name?: string;
}

interface ActorFormStore extends ActorFormData {
  errors: ActorFormErrors;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  validate: () => boolean;
  reset: (data?: Partial<ActorFormData>) => void;
}

const defaultValues: ActorFormData = {
  first_name: '',
  last_name: '',
};

export const useActorFormStore = create<ActorFormStore>((set, get) => ({
  ...defaultValues,
  errors: {},
  
  setFirstName: (value) => set({ first_name: value, errors: { ...get().errors, first_name: undefined } }),
  setLastName: (value) => set({ last_name: value, errors: { ...get().errors, last_name: undefined } }),
  
  validate: () => {
    const { first_name, last_name } = get();
    const errors: ActorFormErrors = {};
    
    if (!first_name || first_name.trim().length === 0) {
      errors.first_name = 'First name is required';
    }
    
    if (!last_name || last_name.trim().length === 0) {
      errors.last_name = 'Last name is required';
    }
    
    set({ errors });
    return Object.keys(errors).length === 0;
  },
  
  reset: (data) => set({ ...defaultValues, ...data, errors: {} }),
}));
