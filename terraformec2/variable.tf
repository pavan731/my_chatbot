variable "gemini_api_key" {
  description = "Secret Gemini API key for chatbot"
  type        = string
  sensitive   = false
}

variable "new_token" {
  description = "GitHub token for authenticating with GHCR"
  type        = string
  sensitive   = false
}