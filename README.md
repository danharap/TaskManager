# FullstackApp - Task Management System

A comprehensive fullstack task management application built with Angular 18 and ASP.NET Core, featuring user authentication, role-based access control, task management with subtasks, calendar integration, analytics, and more.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Task Management**: Create, update, delete, and organize tasks with priority levels
- **Subtask System**: Break down tasks into manageable subtasks with status tracking
- **Calendar Integration**: Visual calendar view for task scheduling and deadline management
- **Real-time Notifications**: In-app notification system with toast messages

### Advanced Features
- **Analytics Dashboard**: Task completion statistics and priority distribution analytics
- **Admin Panel**: User management and administrative controls
- **Theme Support**: Light/dark mode with persistent theme settings
- **Internationalization**: Multi-language support (English/French)
- **Responsive Design**: Mobile-friendly interface with Angular Material components

### User Experience
- **Loading States**: Smooth loading indicators and transitions
- **Floating Action Button**: Quick task creation from any page
- **Settings Management**: User profile management and password changes
- **Help Documentation**: Built-in developer documentation and user help

## 🛠️ Technology Stack

### Frontend
- **Angular 18**: Modern TypeScript-based framework
- **Angular Material**: UI component library for consistent design
- **Angular Calendar**: Calendar component for date management
- **ngx-translate**: Internationalization support
- **RxJS**: Reactive programming for data management

### Backend API
- **ASP.NET Core**: RESTful API backend
- **JWT Authentication**: Secure token-based authentication
- **Entity Framework**: Database ORM
- **Role-based Authorization**: Admin and user role management

### Development Tools
- **Angular CLI**: Project scaffolding and build tools
- **TypeScript**: Type-safe JavaScript development
- **Stylelint**: CSS/SCSS code quality
- **Karma & Jasmine**: Unit testing framework

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI (`npm install -g @angular/cli`)
- .NET 6 SDK or higher (for backend API)

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd FullstackApp

# Install dependencies
npm install

# Start development server
ng serve
```

The application will be available at `http://localhost:4200/`

### Backend Setup
Ensure your ASP.NET Core backend is running on `https://localhost:7119` or update the API URL in the `auth.service.ts` file.

## 🎯 Usage

### Getting Started
1. **Registration**: Create a new account on the registration page
2. **Login**: Access your dashboard with your credentials
3. **Dashboard**: View and manage your tasks from the main dashboard
4. **Task Creation**: Use the floating action button or create task dialog
5. **Calendar View**: Switch to calendar mode for timeline management

### Navigation
- **Dashboard**: Main task overview and management
- **Calendar**: Calendar view of tasks and deadlines
- **Analytics**: Task completion statistics and insights
- **Settings**: User profile and application preferences
- **Admin** (Admin users only): User management and system administration

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, and due date
- **Subtasks**: Break down complex tasks into smaller manageable pieces
- **Priority Levels**: Low, Medium, High priority classification
- **Status Tracking**: Mark tasks and subtasks as complete
- **Search & Filter**: Find tasks by keywords, priority, or completion status

## 🏗️ Architecture

### Component Structure
```
src/app/
├── Components/           # Feature components
│   ├── admin/           # Administration interface
│   ├── analytics-dashboard/ # Task analytics and reporting
│   ├── calendar/        # Calendar view integration
│   ├── dashboard/       # Main task dashboard
│   ├── login/          # Authentication interface
│   ├── settings/       # User preferences
│   └── task-*          # Task-related components
├── models/             # TypeScript interfaces
├── services/           # Business logic and API communication
└── assets/             # Static resources and translations
```

### Key Services
- **AuthService**: User authentication and session management
- **TaskService**: Task CRUD operations and data management
- **NotificationService**: Real-time notification handling
- **ThemeService**: UI theme management
- **ToastService**: User feedback and messaging

## 🔧 Development

### Code Scaffolding
```bash
# Generate a new component
ng generate component component-name

# Generate a service
ng generate service service-name

# Generate other Angular artifacts
ng generate directive|pipe|guard|interface|enum|module
```

### Building for Production
```bash
# Build the project
ng build

# Build for production with optimizations
ng build --prod
```

Build artifacts will be stored in the `dist/` directory.

### Testing
```bash
# Run unit tests
ng test

# Run tests with code coverage
ng test --code-coverage

# Run linting
npm run lint:css
```

### Code Quality
The project includes:
- **Stylelint**: CSS/SCSS code quality enforcement
- **TypeScript**: Strong typing for better code quality
- **Angular Best Practices**: Following Angular style guide

## 🌐 API Integration

The application communicates with a backend API at `https://localhost:7119/api/`. Key endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `PUT /api/auth/username` - Change username
- `PUT /api/auth/password` - Change password

### Tasks
- `GET /api/tasks` - Retrieve user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Admin (Admin role required)
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/{id}/role` - Update user roles

## 🎨 Theming

The application supports both light and dark themes:
- Theme persistence across sessions
- System preference detection
- Smooth theme transitions
- CSS custom properties for easy customization

## 🌍 Internationalization

Multi-language support with:
- English (default)
- French
- Easy addition of new languages
- Dynamic language switching

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For help and documentation:
- Visit the in-app Help section
- Check the Developer Documentation within the application
- Review Angular CLI documentation: [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)

## 🔄 Version History

- **v0.0.0**: Initial release with core task management features
- Built with Angular CLI v18.0.1
- Ongoing development and feature additions

---

Built with ❤️ using Angular 18 and modern web technologies.
