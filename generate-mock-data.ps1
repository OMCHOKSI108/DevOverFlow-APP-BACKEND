$baseUrl = 'http://localhost:3000/api'
$token = Get-Content -Path 'token.txt' -ErrorAction SilentlyContinue

if (-not $token) {
    Write-Host "❌ Token not found in token.txt"
    exit
}

$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $token"
}

Write-Host "🧹 Deleting existing questions by user omchoksi99@gmail.com..."

try {
    $existingQuestions = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Get -Headers $headers
    foreach ($q in $existingQuestions.questions) {
        Write-Host "Deleting: $($q.title)"
        try {
            Invoke-RestMethod -Uri "$baseUrl/questions/$($q._id)" -Method Delete -Headers $headers
        } catch {
            Write-Host "❌ Failed to delete: $($q.title) - $($_.Exception.Message)"
        }
    }
} catch {
    Write-Host "❌ Failed to fetch existing questions: $($_.Exception.Message)"
}

Write-Host "`nPosting 5 questions..."

$questions = @(
    @{ title = "How does event bubbling work in JavaScript?"; body = "Need an explanation with an example."; tags = @("javascript", "dom") },
    @{ title = "What is the use of useEffect in React?"; body = "How does useEffect behave with dependencies?"; tags = @("react", "hooks") },
    @{ title = "Explain REST vs GraphQL?"; body = "What are practical differences and use cases?"; tags = @("api", "graphql", "rest") },
    @{ title = "What is Docker and how is it used?"; body = "Why do developers prefer Docker containers?"; tags = @("docker", "devops") },
    @{ title = "How to connect MongoDB with Node.js?"; body = "Need simple code example using Mongoose."; tags = @("mongodb", "nodejs", "mongoose") }
)

$createdQuestions = @()

foreach ($q in $questions) {
    try {
        $body = $q | ConvertTo-Json -Depth 10
        Write-Host "Posting: $($q.title)"
        $resp = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Post -Headers $headers -Body $body
        $createdQuestions += @{ title = $q.title; id = $resp.question._id }
        Write-Host "✅ Created: $($q.title)"
    } catch {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "❌ Failed: $($q.title)"
        Write-Host "Error: $errorBody"
    }
}

Write-Host "`nPosting answers to the questions..."

foreach ($q in $createdQuestions) {
    try {
        $answer = @{
            content = "Here's a helpful explanation for: $($q.title)"
        } | ConvertTo-Json -Depth 10

        $answerUrl = "$baseUrl/questions/$($q.id)/answers"
        Invoke-RestMethod -Uri $answerUrl -Method Post -Headers $headers -Body $answer
        Write-Host "✅ Answer added to: $($q.title)"
    } catch {
        Write-Host "❌ Failed to add answer to: $($q.title)"
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host "`n🎉 Done! Posted 5 questions and their answers as omchoksi99@gmail.com"
