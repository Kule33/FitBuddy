// Navigation types for Expo Router
export type RootStackParamList = {
  '(tabs)': undefined;
  modal: undefined;
  'auth/login': undefined;
  'auth/register': undefined;
  'details/[id]': { id: string };
};

// Tab navigation types
export type TabParamList = {
  index: undefined;
  explore: undefined;
  favourites: undefined;
  profile: undefined;
};

// Screen props helper types
export type ScreenProps<T extends keyof RootStackParamList> = {
  route: {
    params: RootStackParamList[T];
  };
  navigation: any;
};
