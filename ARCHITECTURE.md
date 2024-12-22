# Architecture

This document describes the high-level requirements of the project and the architectural decisions made to accommodate those requirements.

## Requirements

Create a simple open-source chat app. Showcase your creativity, coding skills, and knack for clean solutions while collaborating with a passionate community

- 👨‍💻 Build a chat app with a GUI in any language.
- ↔️ Direct IP-to-IP messaging.
- 📲 It needs to be a fully functional text messaging app
- 📇 Submissions are links to an Open Source GitHub repository releases tab or include compile instructions.
- 📜 Must include a README (features, installation, usage).

### Bonus Objectives:

- 🖥️ Server hostability (central server).
- 🧹 Clean, well-documented code.
- ✨ Polished, user-friendly GUI.
- 🔒 Encryption for secure messaging.
- 🌐 Cross-platform compatibility.
- 🔧 Scalability and efficient resource use.

## Decisions

For this project I will use [Electron](https://www.electronjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [WebRTC](https://webrtc.org/), and [coturn](https://github.com/coturn/coturn).

[Electron](https://www.electronjs.org/) has been selected to satisfy the requirement of being a GUI application for a fully functional text messaging application. Many well-known applications use this technology already and I am confident it will help me satisfy the bonus objectives of a **Polished, user-friendly GUI**, as well as support **Cross-platform compatibility** since electron applications can be deployed on Windows, MacOS, and Linux machines. I will also be exploring the use of [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/) inside of my electron application for an elegant, **Polished, user-friendly GUI.**

[WebRTC](https://webrtc.org/) has been selected to satisfy the requirements of creating a **real-time chat app**, that is a **fully-functional text messaging app** with **Direct IP-to-IP messaging**. WebRTC also supports the [Datagram Transport Layer Security](https://en.wikipedia.org/wiki/Datagram_Transport_Layer_Security) which can partially help to satisfy the bonus requirement for **Encryption for secure messaging**. For further cryptographic needs the native `Crypto` [module](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) will be used, with the option to suppliment with [libsodium.js](https://github.com/jedisct1/libsodium.js) if applicable.

Finally, compatibility with [coturn](https://github.com/coturn/coturn) will be attempted to satisfy the **Server hostability (central server)** bonus objectives and to facilitate delightful user experience in regards to the **Direct IP-to-IP messaging** requirement's connection handshake. This will also enable **Scalability and efficient resource use**.

## Alternatives Considered

[React Native](https://reactnative.dev/) has been considered as an alternative to a cross-platform GUI solution for the application. [Blazor](https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor) and [MAUI](https://dotnet.microsoft.com/en-us/apps/maui) are also tempting solutions for this project.

[Tauri](https://v2.tauri.app/) has been considered, and is an attractive option due to it directly using the OS web engine resulting in smaller package size, better security, and better performance. However, with this introducing Rust lang to the project, which I have little experience in, and with it not being as mature, introducing this into the project could put the tight timeline in jeopardy.

[Wails.io](https://wails.io/) is a strong candidate. What Tauri is for Rust, Wails.io is for Go. I still don't have as much experience with GO as I do JS/TS, but with what little I've done with go I have found to be delightful and very intuitive. Still Wails.io is not as mature as Electron and while I would _really_ like to try using Wails.io for this project, Electron might end up being the best selection for this project due to the tight deadline. I might revisit this decision to implement using Wails.io in the future.

[JsSIP](https://jssip.net/) and native [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) have been considered for this project also. However due to these solutions requiring a central server, I felt as though these solutions did not meet the **Direct IP-to-IP messaging** requirement.

## Assumptions

Not much of a description for what constitutes a _"fully functional text messaging app"_ has been provided, as a result I will assume that those requirements include:

- Modern Authentication and Authorization
- The ability to send full unicode standard text messages.
- Contact list management.
- Message history with search and export features.
- Support for Attachments (images, videos, audio files, documents)
- Delivery Receipts (sent, delivered, read)
- User Presence status indicators (available, away, busy, offline, custom, etc)
- Message Status indicators (i.e. when the other person is typing)
- Syncing across platforms/devices

Additional requirements that may not be implemented might include:

- Group Messaging
- full Emoji keyboard and rendering support.
- Contact syncing with device contacts or external address books
- Spam Management (reporting/blocking)
- User Profile (username management, profile picture, account linking)
- Notifications/Muting
- Self-destructing messages (ephemeral messages that auto-delete after a set time)
- Data-retention policies and settings
- Message Reactions with emojis
- Schedule Messages
- Editing/Deleting sent messages
- Media compression
- Message Pinning
- Third party integration with external services such as calendars or file storage services
- Analytics and Insights
- Regulatory Compliance (GDPR, CCPA, other data privacy laws)
- Accessibility
- Language Support

## How it was started

- `npm create vite@latest ClapBack -- --tempalte react-ts ./`
- Files moved from `./ClapBack` to `./`
- `npm install`
- `npm run dev` to ensure vite and react were working
- `npm install electron --save-dev`
- created `./main.js`, `./preload.js`
- modified `./vite.config.ts` to include `base: './',`
- modified `package.json` to remove `type: module` and to add start script
- `npm start`

- `npm install -D tailwindcss postcss autoprefixer`
- `npm install @fortawesome/fontawesome-free`
- `npx tailwindcss init -p`
- modified `tailwind.config.js`
- added `./src/tailwind.css`

- removed default style sheet, and reworked components to wire up tailwind