import * as Yup from "yup";

export const authValidator = {
  username: Yup.string()
    .required("Username is required")
    .min(5, "Username must be longer than 5 characters")
    .max(20, "Username must be shorter than 20 characters"),
  email: Yup.string()
    .required("You must enter an email address")
    .email("Email must be valid"),
  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be longer than 5 characters")
    .max(20, "Password must be shorter than 20 characters")
};

export const gameUploadValidator = {
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be longer than 2 characters")
    .max(20, "Title must be shorter than 20 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be longer than 10 characters")
    .max(500, "Description must be shorter than 500 characters"),
  genres: Yup.array()
    .of(Yup.string())
    .required("Select at least one genre")
    .min(1, "Select at least one genre")
    .max(3, "Maximum number of allowed genres is 3"),
  tags: Yup.array()
    .of(Yup.string())
    .required("Select at least one tag")
    .min(1, "Select at least one tag")
    .max(20, "Maximum number of allowed tags is 20"),
  platforms: Yup.array()
    .of(Yup.string())
    .required("Select at least one platform")
    .min(1, "Select at least one platform")
    .max(10, "Maximum number of allowed platforms is 10"),
  languages: Yup.array()
    .of(Yup.string())
    .required("Select at least one language")
    .min(1, "Select at least one language")
    .max(100, "Maximum number of allowed languages is 100"),
  images: Yup.array().required("Upload at least 1 image")
};
