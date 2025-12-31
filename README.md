# CRM SaaS - Industry-Configurable CRM Platform

A universal CRM foundation that auto-configures based on NAICS industry classification. When a user selects their industry, the system loads industry-specific pipelines, custom fields, activity types, modules, and more.

## Features

- **8 Industry Templates**: Project-Based, Sales-Focused, Service-Based, Inventory-Based, Asset-Based, Membership-Based, Hospitality-Based, Case-Based
- **20 NAICS Sectors**: Full coverage with industry-specific configurations
- **6-Layer Customization**: Universal features, templates, sectors, industries, modules, and custom fields
- **Module System**: Industry-specific modules (Job Costing, Crew Scheduling, etc.)
- **Multi-tenant Architecture**: Enterprise-grade security with role-based access control

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Fastify, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Monorepo**: Turborepo with pnpm workspaces
- **Testing**: Playwright E2E tests
- **Deployment**: Vercel (web) + Railway (API)

## Project Structure

```
CRM_SaaS/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # Fastify API server
├── packages/
│   ├── db/                     # Prisma schema & repositories
│   ├── types/                  # TypeScript definitions
│   ├── validation/             # Zod schemas
│   ├── config/                 # Industry configuration registry
│   ├── modules/                # Industry module framework
│   ├── ui/                     # CRM UI components
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared TypeScript config
└── configs/
    ├── sectors/                # NAICS sector configurations
    └── industries/             # Industry-specific overrides
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/CRM_SaaS.git
cd CRM_SaaS
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
pnpm db:push
pnpm db:seed
```

5. Start development servers:
```bash
pnpm dev
```

The web app will be available at http://localhost:3000 and the API at http://localhost:3001.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type check all packages |
| `pnpm test` | Run E2E tests |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed the database |

## Industry Templates

| Template | Sectors | Key Modules |
|----------|---------|-------------|
| Project-Based | Construction, IT, Consulting | Job Costing, Resource Scheduling |
| Sales-Focused | Wholesale, Finance, Real Estate | Territory Management, Commissions |
| Service-Based | Healthcare, Repair, Cleaning | Appointment Scheduling, Dispatch |
| Inventory-Based | Manufacturing, Retail | Inventory Management, Order Fulfillment |
| Asset-Based | Transportation, Mining, Utilities | Fleet Management, Maintenance |
| Membership-Based | Education, Gyms | Enrollment, Member Portal |
| Hospitality | Hotels, Restaurants | Reservations, Table Management |
| Case-Based | Government, Legal | Case Management, Compliance |

## Configuration Inheritance

```
Universal Base (all CRMs)
    ↓
Template (e.g., project-based)
    ↓
Sector (e.g., 23-construction)
    ↓
Industry (e.g., 238160-roofing)
```

This provides ~70% configuration reuse across similar industries.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Configuration
- `GET /config/templates` - List available templates
- `GET /config/sectors` - List NAICS sectors
- `GET /config/preview` - Preview configuration
- `POST /config/initialize` - Initialize tenant with configuration

### CRM
- `GET/POST /crm/contacts` - Contacts CRUD
- `GET/POST /crm/accounts` - Accounts CRUD
- `GET/POST /crm/opportunities` - Opportunities CRUD
- `GET/POST /crm/activities` - Activities CRUD
- `GET/POST /crm/pipelines` - Pipelines CRUD

## Deployment

### Web App (Vercel)

1. Connect your repository to Vercel
2. Set the root directory to `apps/web`
3. Add environment variables
4. Deploy

### API (Railway)

1. Connect your repository to Railway
2. Use the Dockerfile in `apps/api`
3. Add environment variables
4. Deploy

### CI/CD

The repository includes GitHub Actions workflows for:
- Linting and type checking
- Building all packages
- Running E2E tests
- Preview deployments for PRs
- Production deployments on merge to main

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## License

MIT License - see LICENSE for details.
