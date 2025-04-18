import mongoose, { Schema, Document } from "mongoose";

// Interface for full match documents
export interface IMatch extends Document {
  matchId: string;
  region: string;
  matchDetails: any; // Full Riot match JSON object
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const matchSchema = new Schema<IMatch>(
    {
      matchId: { type: String, required: true, unique: true },
      region: { type: String, required: true },
      matchDetails: { type: Schema.Types.Mixed, required: true },
    },
    {
      timestamps: true,
    }
);

// Model export
const MatchModel =
    mongoose.models.Match || mongoose.model<IMatch>("Match", matchSchema);

export default MatchModel;