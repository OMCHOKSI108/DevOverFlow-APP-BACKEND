# Script to fetch all data from the API (users, questions, and answers)
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

Write-Host "`n=== Fetching All Data ==="

# Create output directory if it doesn't exist
$outputDir = "data-export"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Fetch Users
try {
    Write-Host "`n[*] Fetching users..."
    $users = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
    
    if ($users) {
        $users | ConvertTo-Json -Depth 10 | Out-File "$outputDir/users.json"
        Write-Host "[+] Users data saved to $outputDir/users.json"
        Write-Host "[+] Total users: $(if ($users.Count) { $users.Count } else { 0 })"
        
        Write-Host "`n[DEBUG] Sample user data:"
        $users | Select-Object -First 1 | ConvertTo-Json -Depth 2 | Write-Host
    } else {
        Write-Host "[-] No users data received"
    }
} catch {
    Write-Host "[-] Failed to fetch users"
    Write-Host "    Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "    Details: $($_.ErrorDetails.Message)"
    }
}

# Fetch Questions
try {
    Write-Host "`n[*] Fetching questions..."
    $questions = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Get -Headers $headers
    
    if ($questions) {
        $questions | ConvertTo-Json -Depth 10 | Out-File "$outputDir/questions.json"
        Write-Host "[+] Questions data saved to $outputDir/questions.json"
        Write-Host "[+] Total questions: $(if ($questions.Count) { $questions.Count } else { 0 })"
        
        Write-Host "`n[DEBUG] Sample question data:"
        $questions | Select-Object -First 1 | ConvertTo-Json -Depth 2 | Write-Host
    } else {
        Write-Host "[-] No questions data received"
    }
} catch {
    Write-Host "[-] Failed to fetch questions"
    Write-Host "    Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "    Details: $($_.ErrorDetails.Message)"
    }
}

# Fetch Answers for each question
try {
    Write-Host "`n[*] Fetching answers for all questions..."
    $allAnswers = @()
    
    if ($questions -and $questions.Count -gt 0) {
        foreach ($question in $questions) {
            if ($null -ne $question -and $null -ne $question.title -and $null -ne $question._id) {
                Write-Host "    [*] Fetching answers for question: $($question.title)"
                try {
                    $answers = Invoke-RestMethod -Uri "$baseUrl/questions/$($question._id)/answers" -Method Get -Headers $headers
                    if ($answers) {
                        $allAnswers += $answers
                    }
                } catch {
                    Write-Host "    [-] Failed to fetch answers for question: $($question.title)"
                    Write-Host "        Error: $($_.Exception.Message)"
                }
            } else {
                Write-Host "    [-] Skipped invalid question entry"
            }
        }
        
        if ($allAnswers.Count -gt 0) {
            $allAnswers | ConvertTo-Json -Depth 10 | Out-File "$outputDir/answers.json"
            Write-Host "[+] Answers data saved to $outputDir/answers.json"
            Write-Host "[+] Total answers: $($allAnswers.Count)"
            
            Write-Host "`n[DEBUG] Sample answer data:"
            $allAnswers | Select-Object -First 1 | ConvertTo-Json -Depth 2 | Write-Host
        } else {
            Write-Host "[-] No answers found for any questions"
        }
    } else {
        Write-Host "[-] No questions found to fetch answers for"
    }
} catch {
    Write-Host "[-] Failed to process answers"
    Write-Host "    Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "    Details: $($_.ErrorDetails.Message)"
    }
}

# Generate a summary report
$summaryReport = @"
=== Data Export Summary ===
Generated on: $(Get-Date)

Users: $(if ($users -and $users.Count) { $users.Count } else { 0 })
Questions: $(if ($questions -and $questions.Count) { $questions.Count } else { 0 })
Answers: $(if ($allAnswers -and $allAnswers.Count) { $allAnswers.Count } else { 0 })

Files generated:
- $outputDir/users.json
- $outputDir/questions.json
- $outputDir/answers.json
"@

$summaryReport | Out-File "$outputDir/summary.txt"
Write-Host "`n=== Export Complete ==="
Write-Host "Summary saved to $outputDir/summary.txt"

# Display some sample data
Write-Host "`n=== Sample Data Preview ==="

Write-Host "`nLatest Users (up to 3):"
if ($users -and $users.Count -gt 0) {
    $users | Select-Object -First 3 | ForEach-Object {
        if ($null -ne $_ -and $null -ne $_.username) {
            Write-Host "- $($_.username) $(if ($_.email) { "($($_.email))" } else { "(no email)" })"
        }
    }
} else {
    Write-Host "- No users found"
}

Write-Host "`nLatest Questions (up to 3):"
if ($questions -and $questions.Count -gt 0) {
    $questions | Select-Object -First 3 | ForEach-Object {
        if ($null -ne $_ -and $null -ne $_.title) {
            Write-Host "- $($_.title)"
        }
    }
} else {
    Write-Host "- No questions found"
}

Write-Host "`nLatest Answers (up to 3):"
if ($allAnswers -and $allAnswers.Count -gt 0) {
    $allAnswers | Select-Object -First 3 | ForEach-Object {
        if ($null -ne $_ -and $null -ne $_.body) {
            Write-Host "- Answer to question ID: $($_.questionId)"
            Write-Host "  $($_.body.Substring(0, [Math]::Min(100, $_.body.Length)))..."
        } else {
            Write-Host "- Skipped answer with null body"
        }
    }
} else {
    Write-Host "- No answers found"
}
