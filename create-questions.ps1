$authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2IzZjYzYzM5YWNkNDM2OTlkMjgxMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjkwNzc3MiwiZXhwIjoxNzUzNTEyNTcyfQ.HBPYjUW4O-NTY0TPIlAvWGIqensSBqEMf6y5GJUYT0o"
$apiBaseUrl = "http://localhost:3000/api"

$headers = @{
    "Authorization" = "Bearer $authToken"
    "Content-Type"  = "application/json"
}

$questions = @(
    @{ title = "What  the difference between == and === in JavaScript?"; body = "I often get confused between double and triple equals. Please explain with examples."; tags = @("javascript", "comparison") },
    @{ title = "How  async/await work in JavaScript?"; body = "Looking for a simple explanation and an example using async functions."; tags = @("javascript", "async", "await") },
    @{ title = "How  you create responsive layouts using CSS Grid?"; body = "Need guidance on building responsive layouts with CSS Grid."; tags = @("css", "grid", "responsive-design") },
    @{ title = "What  Promises in JavaScript and how do they work?"; body = "What are the states of a Promise and how is it used in practice?"; tags = @("javascript", "promises", "asynchronous") },
    @{ title = "How  handle forms in React using controlled components?"; body = "Want to understand controlled vs uncontrolled components for forms."; tags = @("react", "forms", "controlled-components") }
)

$createdQuestions = @()

foreach ($q in $questions) {
    try {
        $body = $q | ConvertTo-Json -Depth 10
        Write-Host "Posting question: $($q.title)"
        $response = Invoke-RestMethod -Uri "$apiBaseUrl/questions" -Method POST -Headers $headers -Body $body
        
        if ($response.success -eq $true) {
            $createdQuestions += @{ 
                title = $q.title
                id = $response.question._id 
            }
            Write-Host "[+] Created: $($q.title)"
        } else {
            Write-Host "[-] Failed to create: $($q.title)"
        }
    } catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "[-] Error creating: $($q.title)"
        Write-Host "    Error: $($errorDetails.error)"
    }
}

Write-Host "`n=== Summary ==="
Write-Host "------------------------"
Write-Host "Total questions attempted: $($questions.Count)"
Write-Host "Successfully created: $($createdQuestions.Count)"
Write-Host "Failed: $($questions.Count - $createdQuestions.Count)"

if ($createdQuestions.Count -gt 0) {
    $createdQuestions | ConvertTo-Json -Depth 10 | Set-Content -Path "question_ids.json"
    Write-Host "`n[+] Saved question IDs to question_ids.json"
} else {
    Write-Host "`n[!] No questions were created. Please check the errors above."
}
