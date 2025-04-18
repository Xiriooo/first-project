import mongoose, { Schema, Document } from 'mongoose';

export interface PlayerDocument extends Document {
  region: string;
  riotId: string;
  puuid: string;
  accountId: string;
  summonerLevel: number;
}

const PlayerSchema: Schema = new Schema({
  region: { type: String, required: true },
  riotId: { type: String, required: true },
  puuid: { type: String, required: true, unique: true },
  accountId: { type: String, required: true },
  summonerLevel: { type: Number, required: true },
});

export default mongoose.model<PlayerDocument>('Player', PlayerSchema);
