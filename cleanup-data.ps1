# DevOverflow Cleanup Script
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

Write-Host "🧹 Starting cleanup process..."

# Delete all questions
Write-Host "`n📝 Deleting all questions..."
try {
    $questions = Invoke-RestMethod -Uri "$baseUrl/questions" -Method Get -Headers $headers
    $totalQuestions = $questions.questions.Count
    $deletedQuestions = 0

    foreach ($question in $questions.questions) {
        try {
            Invoke-RestMethod -Uri "$baseUrl/questions/$($question._id)" -Method Delete -Headers $headers
            Write-Host "✅ Deleted question: $($question.title)"
            $deletedQuestions++
        } catch {
            Write-Host "❌ Failed to delete question: $($question.title)"
            Write-Host "Error: $($_.Exception.Message)"
        }
    }
    Write-Host "Deleted $deletedQuestions out of $totalQuestions questions"
} catch {
    Write-Host "❌ Failed to fetch questions"
    Write-Host "Error: $($_.Exception.Message)"
}

# Delete all users (except current user)
Write-Host "`n👤 Deleting all users..."
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
    $totalUsers = $users.users.Count
    $deletedUsers = 0

    foreach ($user in $users.users) {
        try {
            Invoke-RestMethod -Uri "$baseUrl/users/$($user._id)" -Method Delete -Headers $headers
            Write-Host "✅ Deleted user: $($user.name) $($user.lastname)"
            $deletedUsers++
        } catch {
            Write-Host "❌ Failed to delete user: $($user.name)"
            Write-Host "Error: $($_.Exception.Message)"
        }
    }
    Write-Host "Deleted $deletedUsers out of $totalUsers users"
} catch {
    Write-Host "❌ Failed to fetch users"
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`n✨ Cleanup complete!"
Write-Host "===================="
