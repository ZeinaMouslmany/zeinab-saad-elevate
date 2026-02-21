# Zeinab Saad Elevate - Coaching Platform

A modern, responsive React application for Zeinab Saad's professional coaching services, featuring an admin dashboard for content management.

## Features

- **Responsive Design**: Mobile-first approach with modern UI components
- **Admin Authentication**: Secure JWT-based admin login system
- **Content Management**: Dynamic content editing through admin dashboard
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **TypeScript**: Full type safety and enhanced developer experience
- **Performance**: Optimized with Vite build system and code splitting

## Tech Stack:

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom service layer
- **Animation**: Framer Motion
- **Testing**: Vitest with React Testing Library

## Project Structure

```
zeinab-saad-elevate/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
├── src/
│   ├── assets/               # Images and media files
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (Radix UI)
│   │   └── admin/           # Admin-specific components
│   ├── constants/           # Application constants
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── services/            # API service layer
│   │   ├── admin/          # Admin API endpoints
│   │   └── api.ts          # Base API configuration
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (not committed)
├── .gitignore              # Git ignore rules
├── components.json         # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md              # This file
```

## Installation

1. **Clone the repository and navigate to frontend directory:**
   ```bash
   cd zeinab-saad-elevate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Application Structure

### Public Pages
- **Home**: Landing page with hero section, services, and contact information
- **About**: Professional background and coaching philosophy
- **Services**: Detailed service offerings
- **Contact**: Contact form and information

### Admin Features
- **Authentication**: Secure login with JWT tokens
- **Dashboard**: Content management interface
- **Content Editor**: Rich text editing for page content
- **Media Management**: Image and video gallery management

## API Integration

The application communicates with a backend API for:
- Admin authentication and authorization
- Content management and updates
- Media file uploads and management

### Service Layer
- `src/services/api.ts` - Base API configuration and utilities
- `src/services/admin/adminApi.ts` - Admin-specific API endpoints

## Styling and Design

- **Design System**: Custom design tokens and component variants
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized CSS with Tailwind's purging

## Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript best practices
- **Prettier**: Code formatting (via ESLint)

### Component Structure
- **Atomic Design**: Components organized by complexity
- **Composition**: Higher-order components for reusability
- **Props Interface**: Well-defined TypeScript interfaces

### State Management
- **Context API**: Used for global state (auth, content)
- **Local State**: useState for component-specific state
- **Server State**: React Query for server data management

## Testing

### Unit Tests
```bash
npm run test
```

### Test Coverage
- Component rendering and interactions
- Custom hooks functionality
- Utility functions
- API service layer

## Deployment

### Build Process
1. Run production build: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables on the hosting platform

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following the established patterns
4. Add tests for new functionality
5. Ensure all tests pass and linting is clean
6. Submit a pull request with a clear description

## Performance Optimization

- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Caching**: Service worker for static asset caching

## Security

- **Content Security Policy**: Configured for secure content loading
- **XSS Protection**: Sanitized user inputs and outputs
- **Authentication**: Secure JWT token handling
- **API Security**: HTTPS-only API communication

## License

This project is proprietary software for Zeinab Saad Elevate coaching services.

## Support

For technical support or questions about the codebase, please contact the development team.
