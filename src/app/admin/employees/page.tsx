'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, UserPlus, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form States
    const [form, setForm] = useState({ name: '', position: '', salary: '', email: '', phone: '' })
    const [editForm, setEditForm] = useState({ name: '', position: '', salary: '', email: '', phone: '' })

    useEffect(() => {
        fetch('/api/employees').then(r => r.json()).then(setEmployees)
    }, [])

    const addEmployee = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/employees', {
            method: 'POST',
            body: JSON.stringify(form)
        })
        if (res.ok) {
            setEmployees([await res.json(), ...employees])
            setForm({ name: '', position: '', salary: '', email: '', phone: '' })
            setIsAddOpen(false)
        }
    }

    const deleteEmployee = async (id: string) => {
        if (!confirm('Are you sure you want to remove this employee?')) return
        const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
            setEmployees(employees.filter(e => e.id !== id))
        }
    }

    const startEdit = (e: any) => {
        setEditingId(e.id)
        setEditForm({ name: e.name, position: e.position, salary: e.salary, email: e.email || '', phone: e.phone || '' })
    }

    const saveEdit = async () => {
        const res = await fetch('/api/employees', {
            method: 'PUT',
            body: JSON.stringify({ id: editingId, ...editForm })
        })
        if (res.ok) {
            const updated = await res.json()
            setEmployees(employees.map(e => e.id === editingId ? updated : e))
            setEditingId(null)
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    <p className="text-muted-foreground mt-1">Manage your team members and roles.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" /> Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>Enter details for the new team member.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={addEmployee} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Position</Label>
                                    <Input required value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Chef" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Salary ($)</Label>
                                    <Input required type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="3000" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 890" />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Add Employee</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                    <Card key={emp.id} className="relative group overflow-hidden">
                        {/* Status Indicator (Just decorative for now) */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                        <CardHeader className="pl-6 pb-2">
                            <div className="flex justify-between items-start">
                                {editingId === emp.id ? (
                                    <Input
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="font-bold h-8 -ml-2"
                                    />
                                ) : (
                                    <CardTitle className="text-xl">{emp.name}</CardTitle>
                                )}

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {editingId === emp.id ? (
                                        <>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={saveEdit}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setEditingId(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(emp)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteEmployee(emp.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {editingId === emp.id ? (
                                <Input
                                    value={editForm.position}
                                    onChange={e => setEditForm({ ...editForm, position: e.target.value })}
                                    className="text-sm text-muted-foreground h-7 -ml-2 w-1/2"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground font-medium">{emp.position}</p>
                            )}
                        </CardHeader>

                        <CardContent className="pl-6">
                            <div className="space-y-3 mt-2 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Salary</span>
                                    {editingId === emp.id ? (
                                        <Input
                                            type="number"
                                            value={editForm.salary}
                                            onChange={e => setEditForm({ ...editForm, salary: e.target.value })}
                                            className="h-6 w-20 text-right"
                                        />
                                    ) : (
                                        <span className="font-semibold">${emp.salary.toLocaleString()}</span>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {editingId === emp.id ? (
                                        <>
                                            <Input
                                                value={editForm.email}
                                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                placeholder="Email"
                                                className="h-7 text-xs"
                                            />
                                            <Input
                                                value={editForm.phone}
                                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                placeholder="Phone"
                                                className="h-7 text-xs"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <span className="truncate">{emp.email || 'No email'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <span>{emp.phone || 'No phone'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
