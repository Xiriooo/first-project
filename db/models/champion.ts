import mongoose, { Schema, Document } from 'mongoose';

export interface ChampionDocument extends Document {
  puuid: string;
  championName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
}

const ChampionSchema: Schema = new Schema({
  puuid: { type: String, required: true },
  championName: { type: String, required: true },
  gamesPlayed: { type: Number, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
});

export default mongoose.model<ChampionDocument>('Champion', ChampionSchema);
