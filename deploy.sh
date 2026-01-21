#!/bin/bash

# Booking WebApp Kubernetes Deployment Script
# This script deploys the booking webapp to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying Booking WebApp to Kubernetes${NC}"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed${NC}"
    exit 1
fi

# Check if we're connected to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Not connected to a Kubernetes cluster${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Current cluster context:${NC}"
kubectl config current-context

# Create namespace if it doesn't exist
NAMESPACE=${1:-default}
echo -e "${YELLOW}🏗️  Creating namespace: $NAMESPACE${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Create Harbor registry secret (update with your credentials)
echo -e "${YELLOW}🔐 Creating Harbor registry secret...${NC}"
echo "Please update the secret with your Harbor credentials:"
echo "kubectl create secret docker-registry harbor-secret \\"
echo "  --docker-server=harbor.yokke.co.id \\"
echo "  --docker-username=<your-username> \\"
echo "  --docker-password=<your-password> \\"
echo "  --namespace=$NAMESPACE"

# Apply the deployment
echo -e "${YELLOW}📦 Applying Kubernetes manifests...${NC}"
kubectl apply -f k8s-deployment.yaml -n $NAMESPACE

# Wait for deployment to be ready
echo -e "${YELLOW}⏳ Waiting for deployment to be ready...${NC}"
kubectl rollout status deployment/booking-webapp -n $NAMESPACE --timeout=300s

# Show deployment status
echo -e "${GREEN}✅ Deployment Status:${NC}"
kubectl get deployments,pods,services,ingress -n $NAMESPACE -l app=booking-webapp

# Get the external IP or URL
echo -e "${GREEN}🌐 Access Information:${NC}"
echo "Internal service: http://booking-webapp-service.$NAMESPACE.svc.cluster.local"
echo "External URL: https://booking.yokke.co.id (if ingress is configured)"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"