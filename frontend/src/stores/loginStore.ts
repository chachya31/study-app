import { create } from 'zustand';

interface LoginStore {
  username: string;
  password: string;
  errors: { username?: string; password?: string };
  isSubmitting: boolean;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  validate: () => boolean;
  setSubmitting: (value: boolean) => void;
  reset: () => void;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  username: '',
  password: '',
  errors: {},
  isSubmitting: false,
  
  setUsername: (value) => set({ username: value, errors: {} }),
  setPassword: (value) => set({ password: value, errors: {} }),
  
  validate: () => {
    const { username, password } = get();
    const errors: { username?: string; password?: string } = {};
    
    if (!username) {
      errors.username = 'ユーザー名は必須です';
    } else if (username.length < 3) {
      errors.username = 'ユーザー名は3文字以上である必要があります';
    }
    
    if (!password) {
      errors.password = 'パスワードは必須です';
    } else if (password.length < 6) {
      errors.password = 'パスワードは6文字以上である必要があります';
    }
    
    set({ errors });
    return Object.keys(errors).length === 0;
  },
  
  setSubmitting: (value) => set({ isSubmitting: value }),
  reset: () => set({ username: '', password: '', errors: {}, isSubmitting: false }),
}));
