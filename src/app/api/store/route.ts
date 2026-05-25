import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const records = await prisma.keyValueStore.findMany()
        
        // Convert array of key-value records to a single dictionary object
        const data = records.reduce((acc, curr) => {
            try {
                acc[curr.key] = JSON.parse(curr.value)
            } catch (e) {
                acc[curr.key] = curr.value
            }
            return acc
        }, {} as Record<string, any>)

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Error fetching from KeyValueStore:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch data' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const { key, value } = await request.json()

        if (!key) {
            return NextResponse.json(
                { success: false, error: 'Key is required' },
                { status: 400 }
            )
        }

        const valueStr = typeof value === 'string' ? value : JSON.stringify(value)

        // Upsert into KeyValueStore in the SQLite database
        const record = await prisma.keyValueStore.upsert({
            where: { key },
            update: { value: valueStr },
            create: { key, value: valueStr }
        })

        return NextResponse.json({ success: true, key: record.key })
    } catch (error: any) {
        console.error('Error saving to KeyValueStore:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to save data' },
            { status: 500 }
        )
    }
}
