# End-to-end testing script for DevOverflow API
$baseUrl = 'http://localhost:3000/api'
$email = "lab.work.charusat.aiml@gmail.com"
$password = "OMchoksi#108"
$name = "OM"
$lastname = "CHOKSI"

Write-Host "`n=== [CLEANUP] Deleting all existing data ==="

# Step 1: Login as admin first to get admin token
try {
    $adminLoginBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    Write-Host "`n[*] Logging in as admin..."
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType 'application/json' -Body $adminLoginBody
    $adminToken = $adminResponse.token
    
    $adminHeaders = @{
        'Content-Type' = 'application/json'
        'Authorization' = "Bearer $adminToken"
    }

    # Delete all existing data
    Write-Host "`n[*] Fetching existing questions..."
    $questions = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Get -Headers $adminHeaders
    foreach ($q in $questions.questions) {
        Write-Host "    Deleting question: $($q._id)"
        Invoke-RestMethod -Uri "$baseUrl/questions/$($q._id)" -Method Delete -Headers $adminHeaders
    }

} catch {
    Write-Host "    [!] Admin cleanup failed. Proceeding with registration..."
}

# Step 2: Login with existing user
Write-Host "`n=== [AUTH] Logging in ==="
try {
    $loginBody = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    Write-Host "[*] Logging in as user: $email"
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType 'application/json' -Body $loginBody
    $token = $loginResponse.token
    $token | Out-File -FilePath "token.txt"
    Write-Host "[+] Login successful! Token saved to token.txt"
} catch {
    Write-Host "[-] Login failed: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "    Details: $($_.ErrorDetails.Message)"
    }
    exit
}

Write-Host "[*] Proceeding with testing..."

# Set up headers for authenticated requests
$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $token"
}

# Step 3: Create questions
Write-Host "`n=== [Q&A] Creating questions ==="

$questions = @(
    @{
        title = "How does event buling work in JavaScript?"
        body = "I need a clear explation of event bubbling in JavaScript with practical examples. How does it affect event handling in the DOM?"
        tags = @("javascript", "dom", "events")
    },
    @{
        title = " is the use of useEffect in React?"
        body = " someone explain the useEffect hook in React? How do dependencies work and what are the common pitfalls?"
        tags = @("react", "hooks", "javascript")
    },
    @{
        title = "Exp REST vs GraphQL?"
        body = "Wha are the main differences between REST and GraphQL? When should I use one over the other?"
        tags = @("api", "graphql", "rest")
    },
    @{
        title = "Wat is Docker and how is it used?"
        body = "Loking for a comprehensive explanation of Docker containers and their benefits in modern development."
        tags = @("docker", "devops", "containers")
    },
    @{
        title = "ow to implement authentication in Node.js?"
        body = "Wat are the best practices for implementing user authentication in a Node.js application? JWT vs Sessions?"
        tags = @("nodejs", "authentication", "security")
    }
)

$createdQuestions = @()

foreach ($q in $questions) {
    try {
        $body = $q | ConvertTo-Json -Depth 10
        Write-Host "[*] Creating question: $($q.title)"
        $response = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Post -Headers $headers -Body $body
        $createdQuestions += @{ 
            id = $response.question._id
            title = $q.title
        }
        Write-Host "[+] Created successfully"
    } catch {
        Write-Host "[-] Failed to create question: $($_.Exception.Message)"
        if ($_.ErrorDetails) {
            Write-Host "    Details: $($_.ErrorDetails.Message)"
        }
    }
    Start-Sleep -Seconds 1
}

# Save question IDs for future use
$createdQuestions | ConvertTo-Json | Out-File "question_ids.json"

# Step 4: Add answers to questions
Write-Host "`n=== [ANSWERS] Adding answers to questions ==="

foreach ($q in $createdQuestions) {
    try {
        $answerBody = @{
            body = "This is a detailed answer for: $($q.title)`n`n" + 
                  "Key points to consider:`n" +
                  "1. Understanding the core concepts`n" +
                  "2. Best practices and common patterns`n" +
                  "3. Performance implications`n" +
                  "4. Real-world examples and use cases`n" +
                  "5. Common pitfalls to avoid"
        } | ConvertTo-Json -Depth 10

        Write-Host "[*] Adding answer to: $($q.title)"
        $answerUrl = "$baseUrl/answer/$($q.id)"
        $response = Invoke-RestMethod -Uri $answerUrl -Method Post -Headers $headers -Body $answerBody
        Write-Host "[+] Answer added successfully"
    } catch {
        Write-Host "[-] Failed to add answer: $($_.Exception.Message)"
        if ($_.ErrorDetails) {
            Write-Host "    Details: $($_.ErrorDetails.Message)"
        }
    }
    Start-Sleep -Seconds 1
}

# Step 5: Fetch and display all data
Write-Host "`n=== [DATA] Fetching final data ==="

# Create output directory
$outputDir = "data-export"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Fetch Questions with Answers
try {
    Write-Host "`n[*] Fetching questions and answers..."
    $allQuestions = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Get -Headers $headers
    $allQuestions | ConvertTo-Json -Depth 10 | Out-File "$outputDir/questions.json"
    Write-Host "[+] Total questions: $($allQuestions.Count)"

    foreach ($question in $allQuestions) {
        Write-Host "`n[Q] Question: $($question.title)"
        Write-Host "    Tags: $($question.tags -join ', ')"
        
        try {
            $answers = Invoke-RestMethod -Uri "$baseUrl/questions/$($question._id)/answers" -Method Get -Headers $headers
            Write-Host "    [A] Number of answers: $($answers.Count)"
        } catch {
            Write-Host "    [-] Failed to fetch answers: $($_.Exception.Message)"
        }
    }
} catch {
    Write-Host "[-] Failed to fetch questions: $($_.Exception.Message)"
}

Write-Host "`n=== [DONE] Test Complete ==="
Write-Host "Data exported to $outputDir/"
