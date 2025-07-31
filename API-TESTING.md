# DevOverFlow API Testing Instructions

This document contains instructions for testing all APIs in the DevOverFlow application using PowerShell's Invoke-WebRequest or Invoke-RestMethod commands.

## Base URL
```powershell
$baseUrl = "http://localhost:3000/api"
```

## Authentication
### Login
```powershell
$loginBody = @{
    email = "your-email@example.com"
    password = "your-password"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}
```

## Questions API
### Get All Questions
```powershell
Invoke-RestMethod -Uri "$baseUrl/questions" -Method Get -Headers $headers
```

### Create Question
```powershell
$questionBody = @{
    title = "Your question title"
    description = "Your detailed question description"
    tags = @("tag1", "tag2", "tag3")
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/questions" -Method Post -Body $questionBody -Headers $headers
```

### Get Question by ID
```powershell
$questionId = "your-question-id"
Invoke-RestMethod -Uri "$baseUrl/questions/$questionId" -Method Get -Headers $headers
```

## Answers API
### Post Answer
```powershell
$answerBody = @{
    questionId = "question-id"
    answerText = "Your detailed answer text"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/answers" -Method Post -Body $answerBody -Headers $headers
```

### Get Answers for Question
```powershell
$questionId = "your-question-id"
Invoke-RestMethod -Uri "$baseUrl/answers/$questionId" -Method Get -Headers $headers
```

## Comments API
### Post Comment
```powershell
$commentBody = @{
    content = "Your comment text"
    parentId = "question-or-answer-id"
    parentType = "Question"  # or "Answer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/comments" -Method Post -Body $commentBody -Headers $headers
```

## User API
### Get User Profile
```powershell
Invoke-RestMethod -Uri "$baseUrl/users/me" -Method Get -Headers $headers
```

### Update User Profile
```powershell
$updateBody = @{
    name = "New Name"
    bio = "New bio information"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/users/update" -Method Put -Body $updateBody -Headers $headers
```

## Error Handling Example
```powershell
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/your-endpoint" -Method Get -Headers $headers
    Write-Host "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
```

## Tips
1. Always include the authentication token in the headers for protected routes
2. Use proper error handling with try-catch blocks
3. For file uploads, use the -Form parameter with Invoke-RestMethod
4. Set proper Content-Type headers based on the request type
