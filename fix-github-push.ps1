$ErrorActionPreference = "Stop"

Write-Host "Cleaning staged generated files..."
git rm -r --cached --ignore-unmatch node_modules dist *.log

Write-Host "Staging project source files..."
git add .gitignore index.html package-lock.json package.json postcss.config.js serve-dist.mjs tailwind.config.js vite.config.js src

Write-Host "Creating initial commit..."
git commit -m "Initial master dashboard"

Write-Host "Ensuring branch and remote are correct..."
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/Wajiha1122-source/master-dashboard.git

Write-Host "Pushing to GitHub..."
git push -u origin main
