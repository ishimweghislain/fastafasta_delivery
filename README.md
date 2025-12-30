# FastaFasta - Multi-Restaurant Food Delivery Platform

A production-ready, full-stack web application using Next.js (TypeScript) and PostgreSQL that allows multiple restaurants to operate independently on one shared food-delivery marketplace.

## Features

### Customer Features
- Browse restaurants and search for food
- View detailed menus and food items
- Add items to cart and manage orders
- Favorite restaurants
- Place orders with multiple payment methods
- Track order status
- Chat with restaurant admins

### Admin Features
- **Super Admin**: Manage all restaurants, create admin accounts
- **Restaurant Admin**: Manage their restaurant, foods, orders, employees
- Dashboard with analytics and insights
- Order management system
- Employee management with payroll
- Real-time chat system
- Payment tracking

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

```bash
# Navigate to project directory
cd fastafasta

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory (copy from `env.template`):

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/fastafasta"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with test data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Test Accounts

### Super Admin
- **Username**: `danger`
- **Password**: `12345`

### Restaurant Admins
- **Username**: `resto1`
- **Password**: `12345`

- **Username**: `resto2` 
- **Password**: `12345`

## Project Structure

```
fastafasta/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── restaurants/       # Restaurant pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout process
│   │   └── ...
│   ├── components/            # React components
│   │   └── ui/               # UI components
│   └── lib/                   # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seed script
└── public/                   # Static assets
```

## Deployment to Vercel

### 1. Prepare for Production

1. Update environment variables in Vercel dashboard
2. Ensure PostgreSQL database is accessible
3. Update JWT secrets to secure values

### 2. Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Or connect your GitHub repository to Vercel for automatic deployments
```

### 3. Production Database Setup

1. Set up PostgreSQL database (Vercel Postgres or external)
2. Update `DATABASE_URL` environment variable
3. Run database migrations:

```bash
# On production
npx prisma db push
npx prisma db seed
```

## Database Schema

The application includes the following main tables:

- `users` - Admin accounts
- `restaurants` - Restaurant information
- `food_categories` - Food categories per restaurant
- `foods` - Food items
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment records
- `chats` - Chat sessions
- `messages` - Chat messages
- `employees` - Restaurant employees
- `salaries` - Employee salary records
- `favorites` - Customer favorites

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with test data

# Prisma Studio (Database GUI)
npx prisma studio
```

## Customization

### Adding New Features

1. **New Pages**: Add to `src/app/` directory
2. **API Routes**: Add to `src/app/api/` directory  
3. **Database Models**: Update `prisma/schema.prisma`
4. **Components**: Add to `src/components/`

### Styling

- Uses Tailwind CSS with custom design system
- UI components from Radix UI
- Icons from Lucide React
- Custom color scheme in `src/app/globals.css`

## Security Features

- JWT-based authentication for admins
- Role-based access control
- Password hashing with bcrypt
- Input validation
- Secure API routes
- Environment variable protection

## Responsive Design

- Mobile-first approach
- Fully responsive layouts
- Touch-friendly interfaces
- Progressive enhancement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Email: support@fastafasta.com
- Documentation: Check this README
- Issues: Create GitHub issues

---

**Built with ❤️ using Next.js and PostgreSQL**
