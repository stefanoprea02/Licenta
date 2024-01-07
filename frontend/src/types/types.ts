export interface UserType {
  _id: string;
  username: string;
  email: string;
}

export interface UserDataType extends UserType {
  token: string;
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

export interface GameType {
  description: string;
  gameFile: string;
  genres: GenreType[];
  images: string[];
  languages: LanguageType[];
  platforms: PlatformType[];
  status: string;
  tags: TagType[];
  title: string;
  user: UserType;
  _id: string;
}

export interface GameMetadataType {
  genres: GenreType[] | null;
  languages: LanguageType[] | null;
  platforms: PlatformType[] | null;
  tags: TagType[] | null;
}

export interface FormField {
  name: string;
  label?: string;
  type: "text" | "password" | "select" | "image";
  selectOptions?: FormFieldSelectOption[];
  maxImages?: number;
  defaultTextValue?: string;
  defaultSelectValue?: string[];
  defaultImageValue?: string[];
}

export interface FormFieldSelectOption {
  value: string;
  label: string;
}
