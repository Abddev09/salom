"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = generateSlug;
exports.generateLink = generateLink;
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_');
}
function generateLink(slug) {
    return `https://t.me/usat_ariza_bot?start=${slug}`;
}
