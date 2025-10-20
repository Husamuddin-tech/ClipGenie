# ClipGenie

<!--![ClipGenie Logo](https://example.com/clipgenie-logo.png) <!-- Replace with actual image URL -->

ClipGenie is a modern web application designed for seamless video clip management and sharing. Built with the latest technologies, it offers a user-friendly interface and robust features for content creators and enthusiasts. Whoever wants to flex their things and their videography can do so by using random emails.

## 🌟 Features

- **User Authentication**: Secure login and registration using NextAuth.js.
- **Video Upload**: Effortless video uploads with real-time progress indicators.
- **Video Management**: Organize, edit, and delete your video clips.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Anonymous Access**: Users can sign up using random emails for quick access.

## 🛠️ Technologies Used

![Next.js Badge](https://img.shields.io/badge/Next.js-latest-blue)
![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-latest-blue)
![NextAuth.js Badge](https://img.shields.io/badge/NextAuth.js-latest-blue)
![MongoDB Badge](https://img.shields.io/badge/MongoDB-latest-blue)
![ImageKit Badge](https://img.shields.io/badge/ImageKit-latest-blue)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-latest-blue)
![ESLint Badge](https://img.shields.io/badge/ESLint-latest-blue)
![Prettier Badge](https://img.shields.io/badge/Prettier-latest-blue)

## 📂 File Structure

```
.
├── README.md
├── app
│   ├── api
│   ├── assets
│   ├── components
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   ├── page.tsx
│   ├── register
│   └── upload
├── eslint.config.mjs
├── lib
│   ├── api-client.ts
│   ├── auth.ts
│   ├── db.ts
│   └── imagekit.ts
├── middleware.ts
├── models
│   ├── User.ts
│   └── Video.ts
├── next-auth.d.ts
├── next-env.d.ts
├── next.config.ts
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
├── tsconfig.json
└── types.d.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB setup
- ImageKit account

### Installation

Clone the repository:

```bash
git clone https://github.com/Husamuddin-tech/ClipGenie.git
cd ClipGenie
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
MONGODB_URI=your-mongodb-uri
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🧪 Testing

Run tests using your preferred testing framework. For example, with Jest:

```bash
npm run test
# or
yarn test
# or
pnpm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
