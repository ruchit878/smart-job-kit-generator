'use client'

import { useRouter } from 'next/navigation'
import jobKitData from '@/data/jobKit.json'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

export default function JobKitPage() {
  const router = useRouter()
  const { skills_match, bonus_points } = jobKitData

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">🔍 Job Requirements vs Your Resume</h1>
        <p className="mt-2 text-gray-600">
          Here’s how your resume stacks up against the job requirements.
        </p>
      </div>

      {/* Skills Table */}
      <Card className="shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Skills Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Skill</th>
                  <th className="px-3 py-2 text-center">In Job</th>
                  <th className="px-3 py-2 text-center">In Resume</th>
                  <th className="px-3 py-2 text-center">Have You Worked On It?</th>
                </tr>
              </thead>
              <tbody>
                {skills_match.map(({ skill, in_job, in_resume }, idx) => (
                  <tr key={skill} className="even:bg-gray-50">
                    <td className="px-3 py-2">{skill}</td>
                    <td className="px-3 py-2 text-center">
                      {in_job ? (
                        <Check className="inline h-5 w-5 text-green-600" />
                      ) : (
                        <X className="inline h-5 w-5 text-red-600" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {in_resume ? (
                        <Check className="inline h-5 w-5 text-green-600" />
                      ) : (
                        <X className="inline h-5 w-5 text-red-600" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {in_resume ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Points */}
      <Card className="shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Bonus Points</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {bonus_points.map((bp) => (
              <li key={bp}>{bp}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Navigate to result page */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={() => router.push('/job-kit/result')}
        >
          Generate Job Kit
        </Button>
      </div>
    </div>
  )
}
