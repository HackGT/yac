
//TODO: this enum needs to be duplicated across apps and matched form cms, make it do it automatiacally on starutp or something

export enum InteractionType {
    Virtual = 'virtual',
    Inperson = 'inperson',
} 


//strings need to match cms, 
export enum EventType{
    Ceremony = "ceremony",
    Food = "food",
    Important = "important",
    MiniChallenge = "mini-challenge",
    MiniEvent = "mini-event",
    Speaker = "speaker",
    TechTalk = "tech-talk",
    Workshop = "workshop",
    Insight = "insight",
    Discord = "discord"
}

export enum IsCMSEvent{
    Food = EventType.Food,
    Ceremony = EventType.Ceremony,
    Important = EventType.Important,
    MiniEvent = EventType.MiniEvent,
    MiniChallenge = EventType.MiniChallenge,
    TechTalk = EventType.TechTalk,
    Speaker = EventType.Speaker,
    Workshop = EventType.Workshop
}

