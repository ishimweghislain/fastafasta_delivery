'use client'

import { useState, useEffect } from 'react'

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(setSettings)
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await fetch('/api/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        })
        setLoading(false)
        alert('Settings Saved')
    }

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Restaurant Settings</h1>
            <form onSubmit={handleSave} className="space-y-4 bg-card p-6 border rounded-lg">
                <div>
                    <label className="block mb-1 font-medium">Restaurant Name</label>
                    <input
                        className="w-full border rounded px-3 py-2 bg-background"
                        value={settings.name || ''}
                        onChange={e => setSettings({ ...settings, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Opening Hours</label>
                    <div className="flex gap-4">
                        <input
                            className="w-full border rounded px-3 py-2 bg-background"
                            placeholder="09:00"
                            value={settings.openingTime || ''}
                            onChange={e => setSettings({ ...settings, openingTime: e.target.value })}
                        />
                        <input
                            className="w-full border rounded px-3 py-2 bg-background"
                            placeholder="22:00"
                            value={settings.closingTime || ''}
                            onChange={e => setSettings({ ...settings, closingTime: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full border rounded px-3 py-2 bg-background"
                        value={settings.description || ''}
                        onChange={e => setSettings({ ...settings, description: e.target.value })}
                    />
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    )
}
