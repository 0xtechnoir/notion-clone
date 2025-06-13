import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workspaceId = searchParams.get('workspaceId')
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 })
    }

    const pages = await prisma.page.findMany({
      where: {
        workspaceId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, parentId, authorId, workspaceId } = body

    if (!title || !authorId || !workspaceId) {
      return NextResponse.json(
        { error: 'Title, author ID, and workspace ID are required' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title,
        parentId: parentId || null,
        authorId,
        workspaceId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}