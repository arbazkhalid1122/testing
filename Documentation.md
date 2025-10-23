# Deployment Setup and Process

## Overview

All applications are deployed on **AWS EC2 instances** using a combination of:

- **PM2** — For Node.js process management.
- **Nginx** — For reverse proxy and load balancing.
- **GitHub Actions** — For continuous deployment via SSH into EC2.

---

## Environment Variables for GitHub Actions

Each of the 4 repositories has the following environment variables configured in **GitHub Secrets**:

- `EC2_HOST` — Public IP address of the EC2 instance.
- `EC2_SSH_KEY` — SSH private key (converted from `.pem` file) used for authentication.
- `EC2_USER` — Set to `ubuntu` (default user for Ubuntu EC2 instances).

---

## GitHub Actions Deployment Workflow

Each repository contains a GitHub Actions workflow located at:

```
.github/workflows/deploy.yml
```

This workflow handles the deployment process by connecting to the EC2 instance and performing the necessary deployment steps.

---

## Git Configuration on EC2

On the EC2 instance, we have **separate Git configurations** for each deployed repository.

- The deployment is triggered by running:

  ```
  git pull upstream main
  ```

- **Authentication** is done via **GitHub Personal Access Token (PAT)**.

---

## GitHub PAT Renewal Process (Every 90 Days)

A new GitHub Personal Access Token (PAT) must be generated and configured on the EC2 instance every 90 days:

> ⚠️ SSH access is managed within the AWS account. No public SSH keys will be provided externally.

### Steps to Update PAT on EC2:

1. SSH into the EC2 instance:

   ```
   ssh ubuntu@<EC2_HOST>
   ```

2. Navigate to each repository directory:

   ```
   cd ~/path-to-repo
   ```

3. Update the remote URL using the new PAT:

   ```
   git remote set-url origin https://<github-username>:<new-pat>@github.com/organization/repository.git
   ```

4. Repeat the above steps for **all repositories**.

5. Restart all PM2 services:

   ```
   pm2 restart all
   ```

---

## PM2 Services and GitHub Repositories Mapping

| PM2 Service Name   | GitHub Repository URL                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `client-backend`   | [https://github.com/print-your-trip/pyt-client-be.git](https://github.com/print-your-trip/pyt-client-be.git) |
| `client-frontend`  | [https://github.com/print-your-trip/pyt-client-fe](https://github.com/print-your-trip/pyt-client-fe)         |
| `staging-backend`  | [https://github.com/print-your-trip/pyt-admin-be.git](https://github.com/print-your-trip/pyt-admin-be.git)   |
| `staging-frontend` | [https://github.com/print-your-trip/pyt-admin-fe.git](https://github.com/print-your-trip/pyt-admin-fe.git)   |

---

## Adding a New Repository to Deployment

To add a new app to the deployment process:

1. **Create the GitHub Repository** (if not already created).

2. **Set GitHub Secrets** in the repository:

   - `EC2_HOST`
   - `EC2_SSH_KEY`
   - `EC2_USER`

3. **Add the Deployment Workflow** to the repo:

   Create a file at:
   ```
   .github/workflows/deploy.yml
   ```
   and configure it to SSH into the EC2 instance and pull the latest changes.

4. **Clone the Repository on the EC2 Instance**:

   ```
   ssh ubuntu@<EC2_HOST>
   git clone https://<github-username>:<PAT>@github.com/organization/repo-name.git
   ```

5. **Install Dependencies & Configure PM2**:

   ```
   cd repo-name
   npm install
   pm2 start <entry-point> --name <pm2-service-name>
   pm2 save
   ```

6. **Set up Git Remote with PAT** for future pulls:

   ```
   git remote set-url origin https://<github-username>:<PAT>@github.com/organization/repo-name.git
   ```

7. **Configure Nginx** if the app requires routing or a domain.

8. **Test Deployment** using a push to the `main` branch.

---

## Notes

- Ensure all GitHub tokens are updated timely on the EC2 instance to prevent deployment failures.
- Verify `.github/workflows/deploy.yml` in each repository matches the latest deployment logic.
- Monitor PM2 services and restart them as necessary after deployments:

  ```
  pm2 restart all
  ```
