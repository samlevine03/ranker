import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react"

const MAX_SCORE = 5.0
const GOOD_THRESHOLD = 3.3
const FINE_THRESHOLD = 1.6

type RankGroup = [string, number][] // list of [name, rating] pairs

type RanksData = {
    rankGroups: RankGroup[]
    size: number
    offset: number
}

export default function Ranker() {
    const [objName, setObjName] = useState('')
    const [goodObjects, setGoodObjects] = useState<RanksData>({ rankGroups: [], size: MAX_SCORE - GOOD_THRESHOLD, offset: GOOD_THRESHOLD })
    const [fineObjects, setFineObjects] = useState<RanksData>({ rankGroups: [], size: GOOD_THRESHOLD - FINE_THRESHOLD, offset: FINE_THRESHOLD })
    const [badObjects, setBadObjects] = useState<RanksData>({ rankGroups: [], size: FINE_THRESHOLD, offset: 0 })

    const [insertionState, setInsertionState] = useState<{
        objectName: string
        category: 'good' | 'fine' | 'bad'
        low: number
        high: number
    } | null>(null)
    const [comparisonMid, setComparisonMid] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)

    // Start the insertion process
    const insertObject = (category: 'good' | 'fine' | 'bad') => {
        if (!objName.trim()) return

        let categoryData: RanksData
        if (category === 'good') {
            categoryData = goodObjects
        } else if (category === 'fine') {
            categoryData = fineObjects
        } else {
            categoryData = badObjects
        }

        const rankGroups = categoryData.rankGroups

        if (rankGroups.length === 0) {
            // Insert directly
            const newRankGroups: RankGroup[] = [[[objName, categoryData.size]]]
            const newCategoryData: RanksData = {
                ...categoryData,
                rankGroups: newRankGroups
            }
            updateCategoryData(category, newCategoryData)
            setObjName('')
        } else {
            // Start binary search
            setInsertionState({
                objectName: objName,
                category: category,
                low: 0,
                high: rankGroups.length - 1,
            })
        }
    }

    // Handle the binary search and modal display
    useEffect(() => {
        if (insertionState !== null) {
            const { low, high } = insertionState
            if (low <= high) {
                const mid = Math.floor((low + high) / 2)
                setShowModal(true)
                setComparisonMid(mid)
            } else {
                // Insert at position 'low'
                insertAtPosition(insertionState.objectName, insertionState.category, insertionState.low)
                setInsertionState(null)
                setShowModal(false)
                setObjName('')
                setComparisonMid(null)
            }
        }
    }, [insertionState])

    // Handle user's comparison result
    const handleComparisonResult = (result: number) => {
        if (insertionState === null || comparisonMid === null) return

        let { low, high } = insertionState

        if (result === 1) {
            // New object is better
            high = comparisonMid - 1
        } else if (result === -1) {
            // New object is worse
            low = comparisonMid + 1
        } else {
            // Objects are equal, insert into group at comparisonMid
            insertIntoGroup(insertionState.objectName, insertionState.category, comparisonMid)
            setInsertionState(null)
            setShowModal(false)
            setObjName('')
            setComparisonMid(null)
            return
        }

        setInsertionState({
            ...insertionState,
            low,
            high,
        })
        setShowModal(false)
        setComparisonMid(null)
    }

    // Insert object into existing group
    const insertIntoGroup = (objectName: string, category: 'good' | 'fine' | 'bad', groupIndex: number) => {
        let categoryData: RanksData = getCategoryData(category)

        const rankGroups = [...categoryData.rankGroups]
        rankGroups[groupIndex] = [...rankGroups[groupIndex], [objectName, 0]]

        // Recalculate ratings
        recalculateRatings(categoryData, rankGroups)

        const newCategoryData = {
            ...categoryData,
            rankGroups: rankGroups
        }

        updateCategoryData(category, newCategoryData)
    }

    // Insert object at a new position
    const insertAtPosition = (objectName: string, category: 'good' | 'fine' | 'bad', position: number) => {
        let categoryData: RanksData = getCategoryData(category)

        const rankGroups = [...categoryData.rankGroups]
        rankGroups.splice(position, 0, [[objectName, 0]])

        // Recalculate ratings
        recalculateRatings(categoryData, rankGroups)

        const newCategoryData = {
            ...categoryData,
            rankGroups: rankGroups
        }

        updateCategoryData(category, newCategoryData)
    }

    // Recalculate ratings after insertion
    const recalculateRatings = (categoryData: RanksData, rankGroups: RankGroup[]) => {
        const totalGroups = rankGroups.length
        for (let i = 0; i < totalGroups; i++) {
            const group = rankGroups[i]
            let newRating = 0
            if (categoryData.offset && totalGroups > 1) {
                newRating = categoryData.size - (categoryData.size / (totalGroups - 1)) * i
            } else {
                newRating = categoryData.size - (categoryData.size / totalGroups) * i
            }
            for (let j = 0; j < group.length; j++) {
                group[j][1] = newRating
            }
        }
    }

    // Utility functions to get and set category data
    const getCategoryData = (category: 'good' | 'fine' | 'bad'): RanksData => {
        if (category === 'good') {
            return goodObjects
        } else if (category === 'fine') {
            return fineObjects
        } else {
            return badObjects
        }
    }

    const updateCategoryData = (category: 'good' | 'fine' | 'bad', data: RanksData) => {
        if (category === 'good') {
            setGoodObjects(data)
        } else if (category === 'fine') {
            setFineObjects(data)
        } else {
            setBadObjects(data)
        }
    }

    // Get the comparison object's name
    const getComparisonObjectName = (): string => {
        if (insertionState === null || comparisonMid === null) return ''
        const categoryData = getCategoryData(insertionState.category)
        const midGroup = categoryData.rankGroups[comparisonMid]
        if (!midGroup || midGroup.length === 0) return ''
        return midGroup[0][0] // First object in the mid group
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ranker</h1>
            <div className="flex space-x-2 mb-4">
                <Input
                    type="text"
                    value={objName}
                    onChange={(e) => setObjName(e.target.value)}
                    placeholder="Enter item name"
                    className="flex-grow"
                />
                <Button onClick={() => insertObject('good')} className="bg-green-500 hover:bg-green-600">Good</Button>
                <Button onClick={() => insertObject('fine')} className="bg-yellow-500 hover:bg-yellow-600">Fine</Button>
                <Button onClick={() => insertObject('bad')} className="bg-red-500 hover:bg-red-600">Bad</Button>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Compare Objects</DialogTitle>
                        <DialogDescription>
                            Is '{insertionState?.objectName}' better than '{getComparisonObjectName()}'?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => handleComparisonResult(1)} className="bg-green-500 hover:bg-green-600">
                            <ThumbsUp className="mr-2 h-4 w-4" /> Better
                        </Button>
                        <Button onClick={() => handleComparisonResult(0)} className="bg-yellow-500 hover:bg-yellow-600">
                            <AlertCircle className="mr-2 h-4 w-4" /> Equal
                        </Button>
                        <Button onClick={() => handleComparisonResult(-1)} className="bg-red-500 hover:bg-red-600">
                            <ThumbsDown className="mr-2 h-4 w-4" /> Worse
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { category: 'good', data: goodObjects },
                    { category: 'fine', data: fineObjects },
                    { category: 'bad', data: badObjects },
                ].map(({ category, data }) => (
                    <div key={category} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2 capitalize">{category}</h2>
                        <ul>
                            {data.rankGroups.map((group, groupIndex) => (
                                <li key={groupIndex}>
                                    <ul>
                                        {group.map(([name, rating], index) => (
                                            <li key={index}>
                                                {name}: {(rating + data.offset).toFixed(1)}/5.0
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
