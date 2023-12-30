export interface UserType {
  _id: string;
  username: string;
  email: string;
}

export interface GenreType {
  _id: string;
  genre: string;
  description: string;
}

export interface LanguageType {
  _id: string;
  language: string;
}

export interface PlatformType {
  _id: string;
  platform: string;
}

export interface TagType {
  _id: string;
  tag: string;
  description: string;
}

export interface FormField {
  name: string;
  label?: string;
  type: string;
  options?: {
    value: string;
    label: string;
  }[];
}
