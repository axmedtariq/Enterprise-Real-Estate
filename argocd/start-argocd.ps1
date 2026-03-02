# This script automatically starts minikube and starts the ArgoCD port-forwarding to make it accessible

Write-Host "🚀 Checking Minikube status..."
$minikubeStatus = minikube status --format='{{.Host}}' 2>$null

if ($minikubeStatus -ne "Running") {
    Write-Host "⚡ Minikube is not running. Starting Minikube cluster..."
    minikube start
}
else {
    Write-Host "✅ Minikube is already running."
}

Write-Host "⏳ Waiting for ArgoCD server pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

Write-Host "🔐 Extracting Default Initial Admin Password..."
$password = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
$decodedPassword = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($password))

Write-Host "✅ Ready!"
Write-Host "🌐 You can access ArgoCD UI at: https://localhost:8081"
Write-Host "Username: admin"
Write-Host "Password: $decodedPassword"
Write-Host ""
Write-Host "🔄 Creating port-forward. Keep this window open!"

kubectl port-forward svc/argocd-server -n argocd 8081:443
