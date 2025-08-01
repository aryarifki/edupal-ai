#!/bin/bash

# EduPal AI Start Script
echo "🚀 Starting EduPal AI..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[EDUPAL]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to start development servers
start_dev() {
    print_header "Starting development servers..."
    
    # Check if required ports are available
    if check_port 3000; then
        print_error "Port 3000 is already in use. Please stop the service using this port."
        exit 1
    fi
    
    if check_port 3001; then
        print_error "Port 3001 is already in use. Please stop the service using this port."
        exit 1
    fi
    
    # Start database if using Docker
    if command -v docker-compose &> /dev/null; then
        print_status "Starting database services..."
        docker-compose up -d postgres redis
        sleep 3
    fi
    
    # Start development servers concurrently
    print_status "Starting backend and frontend servers..."
    npm run dev
}

# Function to start with Docker
start_docker() {
    print_header "Starting with Docker..."
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if ports are available
    local ports=(3000 3001 5432 6379)
    for port in "${ports[@]}"; do
        if check_port $port; then
            print_error "Port $port is already in use. Please stop the service using this port."
            exit 1
        fi
    done
    
    print_status "Building and starting all services..."
    docker-compose up --build
}

# Function to start production mode
start_prod() {
    print_header "Starting in production mode..."
    
    # Build projects first
    print_status "Building projects..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Build failed"
        exit 1
    fi
    
    # Start database
    if command -v docker-compose &> /dev/null; then
        print_status "Starting database services..."
        docker-compose up -d postgres redis
        sleep 3
    fi
    
    # Start backend in production mode
    print_status "Starting backend in production mode..."
    cd apps/backend
    npm run start:prod &
    BACKEND_PID=$!
    cd ../..
    
    # Start frontend in production mode
    print_status "Starting frontend in production mode..."
    cd apps/frontend
    npm run start &
    FRONTEND_PID=$!
    cd ../..
    
    print_status "Services started!"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Frontend PID: $FRONTEND_PID"
    
    # Wait for services
    wait
}

# Function to show status
show_status() {
    print_header "EduPal AI Service Status"
    echo ""
    
    # Check frontend
    if check_port 3000; then
        print_status "Frontend: ✓ Running on http://localhost:3000"
    else
        print_warning "Frontend: ✗ Not running"
    fi
    
    # Check backend
    if check_port 3001; then
        print_status "Backend API: ✓ Running on http://localhost:3001"
    else
        print_warning "Backend API: ✗ Not running"
    fi
    
    # Check database
    if check_port 5432; then
        print_status "Database: ✓ Running on localhost:5432"
    else
        print_warning "Database: ✗ Not running"
    fi
    
    # Check Redis
    if check_port 6379; then
        print_status "Redis: ✓ Running on localhost:6379"
    else
        print_warning "Redis: ✗ Not running"
    fi
    
    echo ""
    
    # Show Docker services if available
    if command -v docker-compose &> /dev/null; then
        print_status "Docker services:"
        docker-compose ps
    fi
}

# Function to stop services
stop_services() {
    print_header "Stopping EduPal AI services..."
    
    # Stop Docker services
    if command -v docker-compose &> /dev/null; then
        print_status "Stopping Docker services..."
        docker-compose down
    fi
    
    # Kill processes using our ports
    local ports=(3000 3001)
    for port in "${ports[@]}"; do
        if check_port $port; then
            print_status "Stopping service on port $port..."
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
    
    print_status "Services stopped"
}

# Function to show logs
show_logs() {
    if command -v docker-compose &> /dev/null; then
        print_header "Showing Docker logs..."
        docker-compose logs -f
    else
        print_error "Docker not available. No centralized logs."
    fi
}

# Function to show help
show_help() {
    echo "EduPal AI - Start Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev, development    Start development servers (default)"
    echo "  docker             Start with Docker Compose"
    echo "  prod, production   Start in production mode"
    echo "  status             Show service status"
    echo "  stop               Stop all services"
    echo "  logs               Show service logs"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Start development servers"
    echo "  $0 docker          # Start with Docker"
    echo "  $0 status          # Check service status"
    echo ""
}

# Main function
main() {
    local mode=${1:-dev}
    
    case $mode in
        "dev"|"development"|"")
            start_dev
            ;;
        "docker")
            start_docker
            ;;
        "prod"|"production")
            start_prod
            ;;
        "status")
            show_status
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            show_logs
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown option: $mode"
            show_help
            exit 1
            ;;
    esac
}

# Handle Ctrl+C gracefully
trap 'print_status "Shutting down..."; stop_services; exit 0' INT

# Run main function
main "$@"