import { useState } from 'react'

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

    const resetGoal = () => {
        setGoal('')
        setPlan(null)
    }

    async function generatePlan() {
        if (goal.trim() === '') return
        setIsLoading(true)
        try {
            const result = await fetchPlanFromApi(goal)
            setPlan(result)
        } finally {
            setIsLoading(false)
        }
    }

    return { goal, setGoal, plan, isLoading, resetGoal, generatePlan }
}
