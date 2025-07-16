"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "./AuthProvider"

export function ResumeForm() {
  const { user } = useAuth()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobUrl, setJobUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleGenerate = async () => {
    if (!resumeFile || !jobUrl) return

    setIsGenerating(true)
    try {
      // Placeholder API call - would normally POST to /api/generate
      const formData = new FormData()
      formData.append("resumeFile", resumeFile)
      formData.append("jobUrl", jobUrl)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Generated kit for:", { resumeFile: resumeFile.name, jobUrl })

      // Reset form after successful generation
      setResumeFile(null)
      setJobUrl("")

      // Reset file input
      const fileInput = document.getElementById("resume-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const isFormValid = resumeFile && jobUrl.trim() && jobUrl.includes("linkedin.com")

  return (
    <Card className="rounded-2xl border p-8 bg-white shadow-lg">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold">Generate Your Kit</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 space-y-6">
        {/* Profile Summary */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Profile Summary</Label>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.photo || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.headline}</p>
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <Label htmlFor="resume-upload" className="text-sm font-medium text-gray-700">
            Resume Upload
          </Label>
          <Input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="rounded-lg border px-4 py-2 w-full"
          />
          {resumeFile && <p className="text-sm text-gray-600">Selected: {resumeFile.name}</p>}
        </div>

        {/* Job URL Field */}
        <div className="space-y-2">
          <Label htmlFor="job-url" className="text-sm font-medium text-gray-700">
            Job URL
          </Label>
          <Input
            id="job-url"
            type="url"
            placeholder="Paste LinkedIn job URL"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="rounded-lg border px-4 py-2 w-full"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!isFormValid || isGenerating}
          className="w-full rounded-full px-6 py-2 font-semibold shadow-sm hover:shadow-md transition"
        >
          {isGenerating ? "Generating Kit..." : "Generate Kit"}
        </Button>
      </CardContent>
    </Card>
  )
}
