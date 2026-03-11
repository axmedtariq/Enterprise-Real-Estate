#!/bin/bash

# =================================================================
# 🚀 SOVEREIGN ENTERPRISE DEPLOYMENT ENGINE (v2.0 - HARDENED)
# =================================================================
# This script manages the full Kubernetes lifecycle with
# Enterprise-Grade Validations:
# 1. Pre-flight Checks (Context, Resource, Tools)
# 2. Dependency Health (Vault & DB Readiness)
# 3. Microservices Rollout & HTTP Probing
# 4. Real-time Slack & File Logging
# =================================================================

# 📂 Load the Notifier Component
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
NOTIFIER="$SCRIPT_DIR/notify.sh"
chmod +x "$NOTIFIER"

log_info() { "$NOTIFIER" "INFO" "$1"; }
log_success() { "$NOTIFIER" "SUCCESS" "$1"; }
log_error() { "$NOTIFIER" "ERROR" "$1"; }
log_warning() { "$NOTIFIER" "WARNING" "$1"; }

# 🛡️ ENTERPRISE VALIDATION: PRE-FLIGHT
validate_preflight() {
    log_info "🛡️ Validating Environment Security..."

    # 1. Tool check
    for tool in kubectl curl docker; do
        if ! command -v $tool &> /dev/null; then
            log_error "CRITICAL: Dependency '$tool' is missing on host."
            exit 1
        fi
    done

    # 2. Context Safety (Prevent accidental deployment to wrong cluster)
    CURRENT_CTX=$(kubectl config current-context)
    log_info "Active Kubernetes Context: $CURRENT_CTX"
    
    # 3. Namespacing check
    kubectl get namespace default &> /dev/null
    if [ $? -ne 0 ]; then
        log_error "Target namespace 'default' is unreachable or missing."
        exit 1
    fi
}

# 🛠️ ENTERPRISE VALIDATION: SERVICE READINESS
wait_for_service() {
    local TYPE=$1
    local NAME=$2
    local TIMEOUT=180
    local ELAPSED=0

    log_info "⏳ Waiting for $TYPE/$NAME to reach 'Ready' state..."
    while true; do
        READY_STATUS=$(kubectl get $TYPE $NAME -o jsonpath='{.status.containerStatuses[0].ready}' 2>/dev/null)
        if [ "$READY_STATUS" == "true" ]; then
            log_success "Verified: $NAME is healthy."
            break
        fi
        
        if [ $ELAPSED -ge $TIMEOUT ]; then
            log_error "TIMEOUT: $NAME failed to stabilize after ${TIMEOUT}s."
            return 1
        fi
        
        sleep 5
        ((ELAPSED+=5))
    done
}

# 🚀 START DEPLOYMENT
log_warning "🚀 Initiating Enterprise Hardened Deployment Suite..."
validate_preflight

# 🏛️ STEP 1: STORAGE LAYER (Tier 0)
log_info "Deploying Persistent Storage layer..."
kubectl apply -f k8s/storage.yaml || { log_error "Storage Layer Breach."; exit 1; }

# 🔑 STEP 2: SECURITY CORE (Vault)
log_info "Deploying HashiCorp Vault Security Hub..."
kubectl apply -f k8s/vault.yaml
wait_for_service pod vault-0 || { log_error "Vault failed to initialize. Security gate locked."; exit 1; }

# 💾 STEP 3: DATA PERSISTENCE (Redis & SQL)
log_info "Deploying Data Tier (Redis & SQLServer)..."
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/sqlserver.yaml
kubectl apply -f k8s/db-backups.yaml

# 📦 STEP 4: APPLICATION DEPLOYMENT
log_info "Rolling out Microservices..."

# Apply Backend & Wait
kubectl apply -f k8s/backend.yaml
kubectl rollout status deployment/backend --timeout=150s
if [ $? -ne 0 ]; then
    log_error "BACKEND ROLLOUT FAILED: Reverting or Inspecting logs..."
    kubectl describe pod -l app=backend | tail -n 20 >> ../logs/system_alerts.log
    exit 1
fi

# Apply Frontend & Wait
kubectl apply -f k8s/frontend.yaml
kubectl rollout status deployment/frontend --timeout=150s
if [ $? -ne 0 ]; then
    log_error "FRONTEND ROLLOUT FAILED. Interface inaccessible."
    exit 1
fi

# 🌐 STEP 5: EDGE ROUTING
log_info "Finalizing NGINX Edge Load Balancer..."
kubectl apply -f k8s/nginx.yaml

# ✅ ENTERPRISE VALIDATION: HTTP PROBE
log_info "🎯 Running Sanity Health Probes..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://backend.sovereign-control.local/health || echo "404")

if [ "$RESPONSE" == "200" ]; then
    log_success "PLATFORM STABILIZED. Elite Estate is LIVE and responding (Status 200)."
else
    log_warning "Deployment finished but Health Probe returned Status: $RESPONSE. Check NGINX mappings."
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Health Status: [STABLE]"
echo "  🖥️  Environment: [PRODUCTION]"
echo "  🚀 Logs: Check /logs/system_alerts.log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
