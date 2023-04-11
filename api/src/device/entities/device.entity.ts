
import * as mongoose from "mongoose";

export type DeviceStatus = 'ONLINE' | 'OFFLINE'

export const DeviceStatus: DeviceStatus[] = ['ONLINE', 'OFFLINE']

export const DeviceSchema = new mongoose.Schema({
  UID: {
    type: String,
    required: true,
    unique: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: DeviceStatus,
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


export interface Device {
  _id: string,
  UID: string,
  vendor: string,
  createdAt: Date,
  status: DeviceStatus
}
