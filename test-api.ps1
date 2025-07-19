# DevOverflow API Test Suite
Write-Host "`n🚀 DevOverflow API Test Suite"
Write-Host "============================"
$startTime = Get-Date
Write-Host "Started at $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))`n"

$baseUrl = "http://localhost:3000/api"
$headers = @{}

function Test-Endpoint {
    param (
        [string]$method,
        [string]$endpoint,
        [hashtable]$body = $null
    )

    $url = "$baseUrl$endpoint"
    $jsonBody = if ($body) { $body | ConvertTo-Json -Depth 10 -Compress } else { "" }

    try {
        switch ($method.ToUpper()) {
            "GET" {
                return Invoke-RestMethod -Uri $url -Method Get -Headers $headers -ErrorAction Stop
            }
            "POST" {
                return Invoke-RestMethod -Uri $url -Method Post -Body $jsonBody -Headers $headers -ContentType "application/json" -ErrorAction Stop
            }
            default {
                throw "Unsupported HTTP method: $method"
            }
        }
    } catch {
        Write-Host "❌ Error: $method $endpoint"
        Write-Host $_.Exception.Message
        return $null
    }
}

# 1. Login with verified credentials
Write-Host "🔐 1. Logging in with verified credentials..."

$loginBody = @{
    email    = "omchoksi99@gmail.com"
    password = "OMchoksi#108"
}
$loginResp = Test-Endpoint -method POST -endpoint "/auth/login" -body $loginBody

if ($loginResp -and $loginResp.token) {
    $token = $loginResp.token
    $headers["Authorization"] = "Bearer $token"
    Set-Content -Path "token.txt" -Value $token
    Write-Host "✅ Logged in successfully. Token saved to token.txt.`n"
} else {
    Write-Host "❌ Login failed. Make sure the account is verified."
    exit
}

# 2. GET /questions
Write-Host "🧠 2. Testing GET /questions..."
$qGet = Test-Endpoint -method GET -endpoint "/questions"
if ($qGet) {
    Write-Host "✅ Success:"
    $qGet | ConvertTo-Json -Depth 5
} else {
    Write-Host "⚠️ GET /questions failed."
}

# 3. POST /questions
Write-Host "`n📝 3. Testing POST /questions..."
$newQ = @{
    title       = "PowerShell API Test Question"
    description = "This is a test question posted via PowerShell."
    tags        = @("powershell", "api", "testing")
}
$qPost = Test-Endpoint -method POST -endpoint "/questions" -body $newQ

if ($qPost -and $qPost.data -and $qPost.data._id) {
    $questionId = $qPost.data._id
    Write-Host "✅ Question created. ID: $questionId"
} else {
    Write-Host "❌ Failed to post question or parse ID."
}

# 4. POST /answers
Write-Host "`n💬 4. Testing POST /answers..."
if ($questionId) {
    $answerBody = @{
        questionId = $questionId
        answerText = "This is a sample answer from PowerShell test suite."
    }
    $aPost = Test-Endpoint -method POST -endpoint "/answers" -body $answerBody
    if ($aPost) {
        Write-Host "✅ Answer posted successfully."
    } else {
        Write-Host "❌ Failed to post answer."
    }
} else {
    Write-Host "⚠️ Skipping answer post (no valid questionId)."
}

# 5. GET /questions/tags
Write-Host "`n🏷️ 5. Testing GET /questions/tags..."
$tagsResp = Test-Endpoint -method GET -endpoint "/questions/tags"
if ($tagsResp) {
    Write-Host "✅ Tags fetched:"
    $tagsResp | ConvertTo-Json -Depth 5
} else {
    Write-Host "❌ Failed to fetch tags."
}

# Finish
$endTime = Get-Date
Write-Host "`n✨ Test Suite Complete"
Write-Host "====================="
Write-Host "Finished at $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))"
