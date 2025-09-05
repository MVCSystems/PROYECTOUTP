"use client"

import { Suspense } from "react"
import DashboardContent from "./dashboard-content"

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center w-full h-screen">
                <div className="w-14 h-14 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}