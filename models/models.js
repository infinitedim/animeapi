import { Schema, model } from "mongoose";

const AnimeModel = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
    sinopsys: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
  },
  {
    timetamps: true,
  }
);

export default model("Anime List", AnimeModel);
