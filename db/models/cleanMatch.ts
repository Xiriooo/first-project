import mongoose, { Schema, Document } from "mongoose";

export interface ICleanMatch extends Document {
    matchId: string;
    puuid: string;
    region: string;
    championPlayed: string;
    primaryRune: number;
    secondaryRune: number;
    items: number[];
    summonerSpells: number[];
    kills: number;
    deaths: number;
    assists: number;
    goldEarned: number;
    damageDealt: number;
    damageReceived: number;
    wardsPlaced: number;
    controlWards: number;
    result: "Win" | "Loss";
    team: "Blue" | "Red";
    role: string;
    lane: string;
    matchDate: Date;
    duration: number;
}

const CleanMatchSchema = new Schema<ICleanMatch>({
    matchId: { type: String, required: true, index: true },
    puuid: { type: String, required: true, index: true },
    region: { type: String, required: true },
    championPlayed: { type: String, required: true },
    primaryRune: Number,
    secondaryRune: Number,
    items: [Number],
    summonerSpells: [Number],
    kills: Number,
    deaths: Number,
    assists: Number,
    goldEarned: Number,
    damageDealt: Number,
    damageReceived: Number,
    wardsPlaced: Number,
    controlWards: Number,
    result: { type: String, enum: ["Win", "Loss"] },
    team: { type: String, enum: ["Blue", "Red"] },
    role: String,
    lane: String,
    matchDate: Date,
    duration: Number,
});

const CleanMatchModel =
    mongoose.models.CleanMatch ||
    mongoose.model<ICleanMatch>("CleanMatch", CleanMatchSchema);

export default CleanMatchModel;
