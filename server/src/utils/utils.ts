

export enum InteractionType {
    Virtual = 'virtual',
    Inperson = 'inperson',
} 


//TODO: this enum needs to be duplicated across apps and matched form cms, make it do it automatiacally on starutp or something
//Note: tag strings need to match cms, 
export const EventType = {
     food: {tag: "food", warnOnDup: true, isCMSEvent: true},
     ceremony: {tag: "ceremony", warnOnDup: false, isCMSEvent: true},
     important: {tag: "important", warnOnDup: false, isCMSEvent: true},
     minichallenge: {tag: "food", warnOnDup: false, isCMSEvent: true},
     minievent: {tag: "food", warnOnDup: false, isCMSEvent: true},
     speaker: {tag: "food", warnOnDup: false, isCMSEvent: true},
     techtalk: {tag: "tech-talk", warnOnDup: false, isCMSEvent: true},
     workshop: {tag: "workshop", warnOnDup: false, isCMSEvent: true},
     insight: {tag: "insight", warnOnDup: false, isCMSEvent: false},
     discord: {tag: "discord", warnOnDup: false, isCMSEvent: false}
}

export type EventType = keyof typeof EventType;

