import * as Yup from "yup";
import Form from "../components/form/form";

export default function Upload() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(event);
  };

  const gameYup = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Title must be longer than 2 characters")
      .max(20, "Title must be shorter than 20 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Title must be longer than 10 characters")
      .max(500, "Title must be shorter than 500 characters"),
    genres: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one genre")
      .max(4, "Maximum number of allowed genres is 3"),
    tags: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one tag")
      .max(21, "Maximum number of allowed genres is 20"),
    platforms: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one platform")
      .max(11, "Maximum number of allowed genres is 10"),
    languages: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one language")
      .max(101, "Maximum number of allowed genres is 100")
  });

  const fields = [
    { name: "username", label: "Username", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "password", label: "Password", type: "password" }
  ];

  return <Form fields={fields} yup={gameYup} onSubmit={handleSubmit} />;
}
