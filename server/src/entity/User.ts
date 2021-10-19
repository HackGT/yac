import { mongoose, RootDocument } from './database'
import {IInteraction, Interaction} from './Interaction'


export interface IUser extends RootDocument {
    uuid: string;
    admin: boolean;
}

export const User = mongoose.model<IUser & mongoose.Document>("User", new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    admin: {
        type: Boolean,
        default: false
    },
},
    {
        usePushEach: true
    }
));


