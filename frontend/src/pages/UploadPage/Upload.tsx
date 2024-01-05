import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import Form from "../../components/form/form";
import useHttp from "../../hooks/use-http";
import {
  FormField,
  FormFieldSelectOption,
  GenreType,
  LanguageType,
  PlatformType,
  TagType
} from "../../types/types";
import { gameUploadValidator } from "../../types/yup-validators";
import styles from "./Upload.module.scss";

export default function Upload() {
  const [data, setData] = useState<{
    [key: string]: FormFieldSelectOption[] | [];
  }>({
    genres: [],
    languages: [],
    platforms: [],
    tags: []
  });
  const { sendRequest } = useHttp();

  const applyData = (
    getResponse: (GenreType | LanguageType | PlatformType | TagType)[],
    requestId: string
  ) => {
    setData((prevData) => ({
      ...prevData,
      [requestId]: getResponse.map((entry) => ({
        value: entry._id,
        label: Object.values(entry)[1]
      }))
    }));
  };

  useEffect(() => {
    const routes = ["genres", "languages", "tags", "platforms"];
    for (const route of routes) {
      sendRequest(
        {
          url: `http://localhost:3000/${route}/getAll`,
          method: "GET",
          headers: {},
          id: `${route}`
        },
        applyData
      );
    }
  }, [sendRequest]);

  const handleUploadResponse = (data: object) => {
    console.log(data);
  };

  const handleSubmit = (data: object) => {
    sendRequest(
      {
        url: `http://localhost:3000/games/uploadDraft`,
        method: "POST",
        body: { data, type: "FormData" },
        headers: {},
        id: "uploadDraft"
      },
      handleUploadResponse
    );
  };

  const gameYup = Yup.object().shape(gameUploadValidator);

  const fields = useMemo(() => {
    const a: FormField[] = [
      { name: "title", label: "Title", type: "text" },
      {
        name: "description",
        label: "Description",
        type: "text"
      },
      {
        name: "genres",
        label: "Genres",
        type: "select",
        selectOptions: data.genres
      },
      {
        name: "tags",
        label: "Tags",
        type: "select",
        selectOptions: data.tags
      },
      {
        name: "platforms",
        label: "Platforms",
        type: "select",
        selectOptions: data.platforms
      },
      {
        name: "languages",
        label: "Languages",
        type: "select",
        selectOptions: data.languages
      },
      { name: "images", type: "image", maxImages: 8 }
    ];
    return a;
  }, [data]);

  return (
    <>
      <div className={styles.uploadPage}>
        <h2>Upload a new game</h2>
        <div className={styles.formContainer}>
          <Form
            fields={fields}
            yup={gameYup}
            onSubmit={handleSubmit}
            submitType="FormData"
          />
        </div>
      </div>
    </>
  );
}
