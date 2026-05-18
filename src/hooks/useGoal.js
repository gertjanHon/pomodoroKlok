import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pomodoro-plan-history'

function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

async function fetchPlanFromApi(goal) {
    const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
    })
    const data = await response.json();
    return data;
}

export function useGoal() {
    const [goal, setGoal] = useState('')
    const [plan, setPlan] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [history, setHistory] = useState(loadHistory)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }, [history])

    const resetGoal = () => {
        setGoal('')
        setPlan(null)
    }

    async function generatePlan() {
        if (goal.trim() === '') return
        setIsLoading(true)
        try {
            const result = await fetchPlanFromApi(goal)
            const entry = {
                id: Date.now(),
                goal,
                plan: result.plan,
                createdAt: new Date().toISOString()
            }
            setHistory((prev) => [entry, ...prev])
            setPlan(result)
        } finally {
            setIsLoading(false)
        }
    }

    function selectPlan(id) {
        const entry = history.find((h) => h.id === id)
        if (!entry) return
        setGoal(entry.goal)
        setPlan({ plan: entry.plan })
    }

    function clearHistory() {
        setHistory([])
    }

    return { goal, setGoal, plan, isLoading, resetGoal, generatePlan, history, selectPlan, clearHistory }
}
