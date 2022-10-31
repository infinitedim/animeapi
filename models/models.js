"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var AnimeModel = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true
    },
    sinopsys: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    year: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});
exports["default"] = (0, mongoose_1.model)("Anime List", AnimeModel);
