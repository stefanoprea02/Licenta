import { GenreType, LanguageType, PlatformType, TagType } from "../types/types";

export const mapMetadataToOptions = (
  metadata: (GenreType | LanguageType | PlatformType | TagType)[] | null
) => {
  return metadata
    ? metadata.map((entry) => ({
        value: entry._id,
        label: Object.values(entry)[1]
      }))
    : [];
};
