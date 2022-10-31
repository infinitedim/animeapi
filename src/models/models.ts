import { Schema, model } from "mongoose";

const AnimeModel = new Schema(
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
    timestamps: true,
  },
);

export default model("Anime List", AnimeModel);
