"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

export function DevelopmentNotice() {
    const [show, setShow] = useState(true)

    if (!show) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-primary/20 relative max-w-sm">
                <div className="flex-1">
                    <p className="font-bold text-sm">Development In Progress</p>
                    <p className="text-xs opacity-90 mt-1">
                        Ghislaing is still developing this website.
                        <br />
                        Contact: 0781262526
                    </p>
                </div>
                <button
                    onClick={() => setShow(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
