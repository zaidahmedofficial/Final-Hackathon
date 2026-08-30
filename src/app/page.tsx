"use client"

import Link from "next/link"
import { useState } from "react"
import { Navbar } from "@/components/custom/navbar"
import { Footer } from "@/components/custom/footer"
import { ComplaintCard } from "@/components/custom/complaint-card"
import { Button } from "@/components/ui/button"
import { mockComplaints } from "@/lib/mockData"

export default function Home() {
  const recentComplaints = mockComplaints.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Report Civic Issues in Karachi in 60 Seconds
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Submit complaints, track progress, and help improve Karachi&apos;s infrastructure. Your voice matters.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-12">Recent Complaints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentComplaints.map((complaint) => (
                <ComplaintCard key={complaint._id} complaint={complaint} showStatusStepper={false} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/complaints">
                <Button variant="outline" size="lg">
                  Browse All Complaints
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
