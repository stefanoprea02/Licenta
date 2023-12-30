import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import Form from "../components/form/form";
import useHttp from "../hooks/use-http";
import { GenreType, LanguageType, PlatformType, TagType } from "../types/types";
import { gameUploadValidator } from "../types/yup-validators";
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
    [key: string]: (GenreType | LanguageType | PlatformType | TagType)[];
  }) => {
    const responseDataName = Object.keys(getResponse)[0];

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
  }, [sendRequest]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(event);
  };

  const gameYup = Yup.object().shape(gameUploadValidator);

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
      },
      { name: "images", type: "image" }
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
