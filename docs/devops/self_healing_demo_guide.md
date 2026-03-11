# 🧪 DevOps Lab: The "Self-Healing" Showcase

To record a high-impact segment for your video, we will perform a "Controlled Sabotage." This demonstrates that even if a "catastrophe" happens, your infrastructure is smart enough to fix itself.

## Scenario 1: The "Vanishing Pod" (Kubernetes Resilience)
*In this scene, you delete a live production pod, and Kubernetes brings it back in seconds.*

1.  **Start Recording**: Show your terminal and the Kiali/Grafana dashboard.
2.  **Sabotage**: Run this command to kill one of your backend pods:
    ```powershell
    kubectl delete pod -l app=backend --now
    ```
3.  **The Recovery**: Immediately run:
    ```powershell
    kubectl get pods -w
    ```
    *Observation:* The video will show one pod "Terminating" and a brand new one "ContainerCreating" instantly. 
4.  **Narration**: "In a standard setup, a deleted pod means downtime. In the Sovereign stack, Kubernetes notices the 'drift' from the desired state and recreates the service instantly."

---

## Scenario 2: The "Configuration Breach" (ArgoCD GitOps)
*In this scene, you manually change a production setting, and ArgoCD "overwrites" your mistake to match the Git repository.*

1.  **Start Recording**: Open the **ArgoCD Dashboard** UI. It should be "Green" (Synced).
2.  **Sabotage**: Manually change the backend image to a "broken" version via CLI:
    ```powershell
    kubectl set image deployment/backend backend=nginx:invalid-tag
    ```
3.  **The Detection**: Watch the ArgoCD UI. The status will turn **Yellow (Out of Sync)**.
4.  **The Healing**: 
    - If **Auto-Sync** is on: Watch ArgoCD immediately start a "Sync" and revert the image back to the correct one from your `backend.yaml`.
    - If **Auto-Sync** is off: Click the **"Sync"** button manually.
5.  **Narration**: "Even if a human error occurs in the live cluster, ArgoCD ensures that Git remains the single source of truth. It automatically detects the configuration drift and reconciles the cluster back to safety."

---

## 🎬 Recording Setup Tips
- **Split Screen**: Have ArgoCD on the left and your Terminal on the right.
- **Speed**: Kubernetes heals fast! Make sure you are ready to record the moment you hit 'Enter' on the delete command.
- **The "Hero" Moment**: End the segment by showing the Grafana Cockpit returning to all "Green" status.
