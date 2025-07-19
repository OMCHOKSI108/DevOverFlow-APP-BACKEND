# Script to post /answers to existing questions
$baseUrl = 'http://localhost:3000/api'
$token = Get-Content -Path 'token.txt' -ErrorAction SilentlyContinue

if (-not $token) {
    Write-Host "[!] Token not found in token.txt"
    exit
}

$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $token"
}

if (-not (Test-Path 'question_ids.json')) {
    Write-Host "[!] question_ids.json not found. Please run create-questions.ps1 first."
    exit
}

$questions = Get-Content -Raw -Path 'question_ids.json' | ConvertFrom-Json

Write-Host "`n=== Posting /answers to questions ==="

foreach ($q in $questions) {
    try {
        $answerBody = @{
            body = "This is a detailed answer for: $($q.title). Here are the key points to consider: 1) Understanding the core concepts, 2) Implementation details, 3) Best practices to follow."
        } | ConvertTo-Json -Depth 10

        $answerUrl = "$baseUrl/answer/$($q.id)"  # Matches server.js mount point: app.use('/api/answer', answersRoutes);
        Write-Host "[*] Attempting to post answer to: $answerUrl"
        Write-Host "[*] Request body: $answerBody"
        
        $response = Invoke-RestMethod -Uri $answerUrl -Method Post -Headers $headers -Body $answerBody
        Write-Host "[+] Answer posted for: $($q.title)"
    } catch {
        Write-Host "[-] Failed to post answer for: $($q.title)"
        Write-Host "    Error: $($_.Exception.Message)"
        if ($_.ErrorDetails) {
            Write-Host "    Details: $($_.ErrorDetails.Message)"
        }
    }
    Start-Sleep -Seconds 1  # Add small delay between requests
}

Write-Host "`n=== Answer posting complete ==="
Write-Host "Successfully processed $($questions.Count) questions"
