# Require Admin rights or simple execution
# Ensure KUBECONFIG is working

Write-Host "🚀 Installing ArgoCD into Kubernetes cluster..."
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

Write-Host "⏳ Waiting for ArgoCD server pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

Write-Host "🔐 Extracting Default Initial Admin Password..."
$password = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
$decodedPassword = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($password))

Write-Host "✅ ArgoCD Installed successfully!"
Write-Host "🌐 You can access ArgoCD UI by port-forwarding:"
Write-Host "kubectl port-forward svc/argocd-server -n argocd 8080:443"
Write-Host "Username: admin"
Write-Host "Password: $decodedPassword"

Write-Host ""
Write-Host "📦 Applying the Real Estate Enterprise App to ArgoCD..."
kubectl apply -f application.yaml

Write-Host "Done! The application should begin syncing from git."
