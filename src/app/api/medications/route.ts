import { medicationStore } from '@/app/lib/medicationStore';
import { NextRequest, NextResponse } from 'next/server';

// GET all medications
export async function GET() {
  try {
    const medications = medicationStore.getAll();
    return NextResponse.json(medications);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}

// POST create new medication
export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      
      // Validate required fields
      if (!body.name || !body.dosageTotal || !body.frequency) {
        return NextResponse.json(
          { error: 'Missing required fields: name, dosageTotal, frequency' },
          { status: 400 }
        );
      }

      const dosageMissedPercentage = Math.round(body.dosageMissed/ body.dosageTotal * 100);
      
      const newMedication = medicationStore.add({
          name: body.name,
          frequency: body.frequency,
          dosageTotal: body.dosageTotal,
          dosageRemaining: body.dosageRemaining,
          dosageMissed: body.dosageMissed,
          note: body.note || undefined,
          startDate: body.startDate,
          dnc: body.dnc,
      });
      
      return NextResponse.json(newMedication, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to create medication' },
        { status: 500 }
      );
    }
  }