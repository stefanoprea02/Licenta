import cx from "classnames";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useHttp from "../../hooks/use-http";
import { GameMetadataContext } from "../../store/GameMetadataContext";
import { GameMetadataType, GameType } from "../../types/types";
import { gameUploadValidator } from "../../types/yup-validators";
import { mapMetadataToOptions } from "../../utils/mappers";
import ImagesInput from "../images-input/images-input";
import InputElement from "../input-element/input-element";
import SelectForm from "../select-form/select-form";
import styles from "./game-details-editor.module.scss";

interface GameDetailsEditorProps {
  gameId?: string;
  gameData?: GameType;
}

type FormData = {
  title: string;
  description: string;
  genres: string[];
  tags: string[];
  platforms: string[];
  languages: string[];
  images: File[];
  oldImages: string[];
};

export default function GameDetailsEditor({
  gameId,
  gameData
}: GameDetailsEditorProps) {
  const ctx = useContext(GameMetadataContext);
  const { sendRequest } = useHttp();
  const navigation = useNavigate();
  const gameYup = Yup.object().shape(gameUploadValidator);

  const [valid, setValid] = useState({
    title: { valid: gameData ? true : false, message: "" },
    description: { valid: gameData ? true : false, message: "" },
    genres: { valid: gameData ? true : false, message: "" },
    tags: { valid: gameData ? true : false, message: "" },
    platforms: { valid: gameData ? true : false, message: "" },
    languages: { valid: gameData ? true : false, message: "" },
    images: { valid: gameData ? true : false, message: "" },
    oldImages: { valid: true, message: "" }
  });

  const initialFormData = {
    title: gameData ? gameData.title : "",
    description: gameData ? gameData.description : "",
    genres: gameData ? gameData.genres.map((genre) => genre._id) : [],
    tags: gameData ? gameData.tags.map((tag) => tag._id) : [],
    platforms: gameData
      ? gameData.platforms.map((platform) => platform._id)
      : [],
    languages: gameData ? gameData.languages.map((genre) => genre._id) : [],
    images: [],
    oldImages: gameData ? gameData.images : []
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleUploadResponse = (data: { message: string }) => {
    navigation(`/upload/2/${data.message}`);
  };

  const handleSubmit = () => {
    const formDataAux = new FormData();

    const appendArrayToFormData = (array: string[], key: string) => {
      for (const element of array) {
        formDataAux.append(`${key}[]`, element);
      }
    };

    formDataAux.append("title", formData.title);
    formDataAux.append("description", formData.description);
    appendArrayToFormData(formData.genres, "genres");
    appendArrayToFormData(formData.tags, "tags");
    appendArrayToFormData(formData.languages, "languages");
    appendArrayToFormData(formData.platforms, "platforms");
    if (formData.oldImages.length > 0) {
      appendArrayToFormData(formData.oldImages, "oldImages");
    }

    if (formData.images) {
      for (const image of formData.images) {
        formDataAux.append("images", image);
      }
    }

    sendRequest(
      {
        url: `http://localhost:3000/games/${
          gameId ? `editDraft?id=${gameId}` : "uploadDraft"
        }`,
        method: "POST",
        body: { data: formDataAux, type: "FormData" },
        headers: {},
        id: "uploadDraft"
      },
      handleUploadResponse
    );
  };

  const verifyAndUpdateState = (
    fieldName: string,
    value: string | string[] | File[]
  ) => {
    try {
      gameYup.validateSyncAt(fieldName, { [fieldName]: value });
      setValid((prev) => ({ ...prev, [fieldName]: { valid: true } }));
    } catch (err: unknown) {
      const message = err instanceof Yup.ValidationError ? err.message : "";
      setValid((prev) => ({
        ...prev,
        [fieldName]: { valid: false, message: message }
      }));
    }
  };

  const handleSelectInputChange = (name: string, values: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values
    }));
    verifyAndUpdateState(name, values);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];

    if (file) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, file] }));
      verifyAndUpdateState("images", [...formData.images, file]);

      fileInput.value = "";
    } else {
      setFormData((prev) => ({
        ...prev,
        [event.target.name]: event.target.value
      }));
      verifyAndUpdateState(event.target.name, event.target.value);
    }
  };

  const formIsValid = Object.entries(valid).every(([, value]) => value.valid);

  return (
    <>
      <h2>{gameId ? "Update game information" : "Upload a new game"}</h2>
      <div className={styles.formContainer}>
        return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (
              JSON.stringify(initialFormData) === JSON.stringify(formData) &&
              gameId
            )
              handleUploadResponse({ message: gameId });
            else handleSubmit();
          }}
          className={styles.form}
        >
          {(["title", "description"] as (keyof FormData)[]).map((value) => {
            return (
              <div className={styles.formSection} key={value}>
                <InputElement
                  name={value}
                  value={formData[value] as string}
                  handleInputChange={handleInputChange}
                  verifyAndUpdateState={verifyAndUpdateState}
                  validationMessage={valid[value].message}
                />
              </div>
            );
          })}

          {(
            [
              "genres",
              "tags",
              "platforms",
              "languages"
            ] as (keyof GameMetadataType)[]
          ).map((value) => {
            return (
              <div className={styles.formSection} key={value}>
                <SelectForm
                  defaultValue={
                    gameData &&
                    gameData[value].map((entry) => ({
                      label: Object.values(entry)[1],
                      value: entry._id
                    }))
                  }
                  name={value}
                  selectOptions={mapMetadataToOptions(ctx.gameMetadata[value])}
                  handleInputChange={handleSelectInputChange}
                  handleInputBlur={() =>
                    verifyAndUpdateState(value, formData[value])
                  }
                  validationMessage={valid[value].message}
                />
              </div>
            );
          })}

          <ImagesInput
            imageFiles={formData.images}
            imageStrings={formData.oldImages}
            handleInputChange={handleInputChange}
            validationMessage={valid.images.message}
            handleRemoveImageString={(id) => {
              setFormData((prev) => ({
                ...prev,
                oldImages: prev.oldImages.filter((image) => image !== id)
              }));
              const currentImages =
                formData.oldImages.filter((image) => image !== id).length +
                formData.images.length;
              setValid((prev) => ({
                ...prev,
                images: {
                  valid: currentImages > 0 ? true : false,
                  message: ""
                }
              }));
            }}
            handleRemoveImageFile={(name) => {
              setFormData((prev) => ({
                ...prev,
                images: prev.images.filter((image) => image.name !== name)
              }));
              verifyAndUpdateState(
                "images",
                formData.images.filter((image) => image.name !== name)
              );
            }}
          />

          <button
            className={cx(styles.button, !formIsValid && styles.buttonInvalid)}
            type="submit"
            disabled={!formIsValid}
          >
            {JSON.stringify(initialFormData) === JSON.stringify(formData)
              ? "Next"
              : "Submit"}
          </button>
        </form>
        );
      </div>
    </>
  );
}
