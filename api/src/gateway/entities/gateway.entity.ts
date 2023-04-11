import * as mongoose from "mongoose";
import { Device } from "src/device/entities/device.entity";

export const GatewaySchema = new mongoose.Schema({
  serial: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  IPv4: {
    type: String,
    required: true
  },
  devices: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Device'
  }]
}, {
  timestamps: true,
  versionKey: false
})

export interface Gateway {
  id: string,
  serial: string,
  name: string,
  IPv4: string,
  devices: Device[]
}
