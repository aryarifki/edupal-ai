#!/bin/bash

# EduPal AI Setup Script
echo "🚀 Setting up EduPal AI..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt "18" ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Node.js version: $(node --version) ✓"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_status "npm version: $(npm --version) ✓"
}

# Check if Docker is installed (optional)
check_docker() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Docker and Docker Compose are available ✓"
        return 0
    else
        print_warning "Docker not found. You can still run the project manually."
        return 1
    fi
}

# Install root dependencies
install_root_deps() {
    print_status "Installing root dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install root dependencies"
        exit 1
    fi
}

# Install workspace dependencies
install_workspace_deps() {
    print_status "Installing workspace dependencies..."
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd apps/frontend
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ../..
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd apps/backend
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ../..
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created .env file from template"
        print_warning "Please edit .env file with your API keys and configuration"
    else
        print_status ".env file already exists"
    fi
    
    # Frontend env
    if [ ! -f apps/frontend/.env.local ]; then
        cat > apps/frontend/.env.local << EOF
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3002
EOF
        print_status "Created frontend .env.local file"
    fi
    
    # Backend env
    if [ ! -f apps/backend/.env ]; then
        cat > apps/backend/.env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/edupal_ai"
JWT_SECRET="your-jwt-secret"
API_PORT=3001
CORS_ORIGIN="http://localhost:3000"
EOF
        print_status "Created backend .env file"
    fi
}

# Setup database (if Docker is available)
setup_database() {
    if check_docker; then
        print_status "Setting up database with Docker..."
        docker-compose up -d postgres redis
        sleep 5
        
        # Wait for PostgreSQL to be ready
        print_status "Waiting for PostgreSQL to be ready..."
        until docker-compose exec postgres pg_isready -U postgres; do
            sleep 2
        done
        
        print_status "Database is ready ✓"
    else
        print_warning "Docker not available. Please set up PostgreSQL manually:"
        print_warning "1. Install PostgreSQL"
        print_warning "2. Create database 'edupal_ai'"
        print_warning "3. Update DATABASE_URL in .env file"
    fi
}

# Generate Prisma client
setup_prisma() {
    print_status "Setting up Prisma..."
    cd apps/backend
    
    # Generate Prisma client
    npx prisma generate
    if [ $? -ne 0 ]; then
        print_error "Failed to generate Prisma client"
        exit 1
    fi
    
    # Push database schema (if database is available)
    if docker-compose ps postgres | grep -q "Up"; then
        print_status "Pushing database schema..."
        npx prisma db push
        if [ $? -eq 0 ]; then
            print_status "Database schema updated ✓"
            
            # Seed database with demo data
            print_status "Seeding database with demo data..."
            npm run prisma:seed
        fi
    else
        print_warning "Database not available. Run 'npx prisma db push' manually after setting up the database."
    fi
    
    cd ../..
}

# Build projects
build_projects() {
    print_status "Building projects..."
    
    # Build backend
    print_status "Building backend..."
    cd apps/backend
    npm run build
    if [ $? -ne 0 ]; then
        print_warning "Backend build failed (this is okay for development)"
    fi
    cd ../..
    
    # Frontend doesn't need to be built for development
}

# Main setup function
main() {
    print_status "Starting EduPal AI setup..."
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_root_deps
    install_workspace_deps
    
    # Setup configuration
    setup_env
    
    # Setup database
    setup_database
    
    # Setup Prisma
    setup_prisma
    
    # Build projects
    build_projects
    
    print_status "Setup completed! 🎉"
    echo ""
    print_status "Next steps:"
    echo "1. Edit .env files with your API keys"
    echo "2. Run 'npm run dev' to start development servers"
    echo "3. Visit http://localhost:3000 to see the application"
    echo ""
    print_status "For Docker users:"
    echo "Run 'docker-compose up' to start all services"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main