# Script to extract CSS from all page.jsx files

Write-Host "Extracting CSS from login page..." -ForegroundColor Green

# Login Page CSS
$loginCSS = @"
/* Login Page Styles */

.container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.bgDecoration1,
.bgDecoration2 {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
}

.bgDecoration1 {
    width: 300px;
    height: 300px;
    background: white;
    top: -100px;
    left: -100px;
}

.bgDecoration2 {
    width: 400px;
    height: 400px;
    background: white;
    bottom: -150px;
    right: -150px;
}

.card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    padding: 48px;
    width: 100%;
    max-width: 450px;
    position: relative;
    z-index: 1;
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.logoImage {
    width: 120px;
    height: 120px;
    object-fit: contain;
    margin-bottom: 20px;
}

.title {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.formGroup {
    display: flex;
    flex-direction: column;
}

.label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
}

.icon {
    font-size: 18px;
}

.input {
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s;
    outline: none;
    background-color: #ffffff;
    color: #2c3e50;
}

.input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input::placeholder {
    color: #95a5a6;
}

.inputError {
    border-color: #e74c3c;
}

.inputError:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error {
    color: #e74c3c;
    font-size: 13px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.forgotPassword {
    text-align: right;
    margin-top: -8px;
}

.forgotPasswordLink {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
}

.forgotPasswordLink:hover {
    text-decoration: underline;
}

.submitButton {
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 8px;
}

.submitButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submitButton:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e0e0e0;
}

.dividerText {
    background: white;
    padding: 0 16px;
    color: #95a5a6;
    font-size: 14px;
    position: relative;
}

.registerLink {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #7f8c8d;
}

.registerLinkButton {
    color: #667eea;
    text-decoration: none;
    font-weight: bold;
    margin-left: 4px;
}

.registerLinkButton:hover {
    text-decoration: underline;
}
"@

$loginCSS | Set-Content "src\app\login\page.module.css" -Encoding UTF8

Write-Host "✓ Login CSS created" -ForegroundColor Cyan
Write-Host "Updating login page.jsx..." -ForegroundColor Green

# Update login page.jsx
(Get-Content "src\app\login\page.jsx" -Raw) -replace "('use client';)", "`$1`nimport styles from './page.module.css';" | Set-Content "src\app\login\page.jsx" -Encoding UTF8
(Get-Content "src\app\login\page.jsx" -Raw) -replace 'style=\{styles\.', 'className={styles.' | Set-Content "src\app\login\page.jsx" -Encoding UTF8
(Get-Content "src\app\login\page.jsx" -Raw) -replace '(?s)const styles = \{.*?\};', '' | Set-Content "src\app\login\page.jsx" -Encoding UTF8

Write-Host "✓ Login page updated" -ForegroundColor Cyan
Write-Host "`nAll CSS modules created successfully!" -ForegroundColor Green
"@
<parameter name="Complexity">5
