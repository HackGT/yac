# Yet Another Checkin

## Logs every interaction for every\* event at HackGT

## How to Log:

- Send a POST request to `/log/interaction` to log an interaction
  - Note: This will be deployed to `log.2021.hack.gt` (as of now at least)
- Requests should be signed with `ADMIN_SECRET` set as Bearer Token
- Params for loginteraction:
  - uuid: user's Ground Truth UserID
  - eventID: CMS eventID if event is CMS event. Else, should just be event name (should be unique)
  - interactionType: string that has a value in `InteractionType`: As of rn it is `inperson` | `virtual`
  - eventType: string corresponding to matching tag of `EventType`.
- For more information on `EventType` and `InteractionType` see `utils/util.ts`

- Sample CuRL request:
  ```
  curl -X POST http://localhost:3000/log/interaction -H 'Content-Type: application/json' -H 'Authorization: Bearer test' -d '{"uuid":"606e25a1-9b86-4af1-b849-8e0f0ec51b1c", "eventID":"616b29851c03860022fc7493", "interactionType": "inperson", "eventType":"food"}'
  ```
- Log route located in `event.ts`

## How to Read Logs:

- Routes located in `user.ts`
- Same as VCheckin
- TODO: look at what's in there and fill this out, only prizes should care about this

## Contributing:

1. Go to `/server`
2. `yarn install`
3. Run `yarn dev`
