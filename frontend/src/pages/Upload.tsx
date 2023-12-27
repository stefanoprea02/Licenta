import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import Form from "../components/form/form";
import useHttp from "../hooks/use-http";
import styles from "./Upload.module.scss";

export default function Upload() {
  const [data, setData] = useState({
    genres: [{ value: "", label: "" }],
    languages: [{ value: "", label: "" }],
    platforms: [{ value: "", label: "" }],
    tags: [{ value: "", label: "" }]
  });
  const { sendRequest } = useHttp();

  const applyData = (getResponse: {
    [key: string]: { _id: string; [name: string]: string }[];
  }) => {
    const responseDataName = Object.keys(getResponse)[0];
    console.log(getResponse);

    if (responseDataName) {
      setData((prevData) => ({
        ...prevData,
        [responseDataName]: getResponse[responseDataName].map((entry) => ({
          value: entry._id,
          label: Object.values(entry)[1]
        }))
      }));
    }
  };

  useEffect(() => {
    const routes = ["genres", "languages", "tags", "platforms"];
    for (const route of routes) {
      sendRequest(
        {
          url: `http://localhost:3000/${route}/getAll`,
          method: "GET",
          headers: {},
          id: `get-${route}`
        },
        applyData
      );
    }
  }, []);

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
      .max(100, "Maximum number of allowed languages is 100")
  });

  const fields = useMemo(
    () => [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "genres", label: "Genres", type: "select", options: data.genres },
      {
        name: "tags",
        label: "Tags",
        type: "select",
        options: data.tags
      },
      {
        name: "platforms",
        label: "Platforms",
        type: "select",
        options: data.platforms
      },
      {
        name: "languages",
        label: "Languages",
        type: "select",
        options: data.languages
      }
    ],
    [data]
  );

  return (
    <>
      <div className={styles.uploadPage}>
        <h2>Upload a new game</h2>
        <div className={styles.formContainer}>
          <Form fields={fields} yup={gameYup} onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
}
