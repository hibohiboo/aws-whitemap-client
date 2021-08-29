import { inject, InjectionKey, reactive } from 'vue';
import { auth } from '@/domain/firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';

const authStore = () => {
  console.log('init authStore');
  const state = reactive({
    isLoggedin: false,
    displayName: '',
    photoURL: '',
    uid: '',
  });

  const setUser = (user: User | null) => {
    state.isLoggedin = !!user;
    if (user) {
      state.displayName = user.displayName ?? '';
      state.photoURL = user.photoURL ?? '';
      state.uid = user.uid;
    }
  };

  const signin = async () => {
    await signInAnonymously(auth);
  };

  const signout = () => auth.signOut();
  onAuthStateChanged(auth, (user) => setUser(user));

  return {
    state,
    signin,
    signout,
  };
};

export default authStore;

type AuthStore = ReturnType<typeof authStore>;

export const authStoreKey: InjectionKey<AuthStore> = Symbol('authStore');

export const useAuthStore = () => {
  const store = inject(authStoreKey);
  if (!store) {
    throw new Error(`${authStoreKey} is not provided`);
  }
  return store;
};
