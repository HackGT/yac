import { mongoose, RootDocument } from './database'
import {IInteraction, Interaction} from './Interaction'


export interface IOrganizer extends RootDocument {
    uuid: string;
    email: string;
    name: string;
    token: string;
    admin: boolean;
}

export const Organizer = mongoose.model<IOrganizer & mongoose.Document>("Organizer", new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    token: String,
    admin: {
        type: Boolean,
        default: false
    },
},
    {
        usePushEach: true
    }
));


