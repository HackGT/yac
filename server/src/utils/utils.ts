

export enum InteractionType {
    Virtual = 'virtual',
    Inperson = 'inperson',
} 

//TODO: this enum needs to be duplicated across apps and matched form cms, make it do it automatiacally on starutp or something
//Note: tag strings need to match cms, 
export const EventType = {
     food: {warnOnDup: true, isCMSEvent: true},
     ceremony: {warnOnDup: false, isCMSEvent: true},
     important: { warnOnDup: false, isCMSEvent: true},
     "mini-challenge": {warnOnDup: false, isCMSEvent: true},
     "mini-event": {warnOnDup: false, isCMSEvent: true},
     "speaker": {warnOnDup: false, isCMSEvent: true},
     "tech-talk": { warnOnDup: false, isCMSEvent: true},
     "workshop": { warnOnDup: false, isCMSEvent: true},
     "insight": { warnOnDup: false, isCMSEvent: false},
     "discord": {warnOnDup: false, isCMSEvent: false},
     "scavenger-hunt": {warnOnDup: false, isCMSEvent: false}
}

export type EventType = keyof typeof EventType;
