'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { PageList } from '@/components/page-list'

interface Page {
  id: string
  title: string
  slug?: string
  parentId?: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name?: string
    email: string
  }
  children: {
    id: string
    title: string
    slug?: string
  }[]
}

export default function HomePage() {
  const [pages, setPages] = useState<Page[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>()
  const [loading, setLoading] = useState(true)

  // Mock data for now since we don't have authentication yet
  const mockWorkspaceId = 'workspace-1'
  const mockUserId = 'user-1'

  const fetchPages = async () => {
    try {
      const response = await fetch(`/api/pages?workspaceId=${mockWorkspaceId}`)
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePage = async (title: string, parentId?: string) => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          parentId,
          authorId: mockUserId,
          workspaceId: mockWorkspaceId,
        }),
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      console.error('Error creating page:', error)
    }
  }

  const handleDeletePage = async (id: string) => {
    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPages()
        if (selectedPageId === id) {
          setSelectedPageId(undefined)
        }
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const handleSelectPage = (page: Page) => {
    setSelectedPageId(page.id)
  }

  useEffect(() => {
    fetchPages()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        pages={pages}
        onCreatePage={handleCreatePage}
        onSelectPage={setSelectedPageId}
        selectedPageId={selectedPageId}
      />
      <main className="flex-1 p-6">
        <PageList
          pages={pages}
          onCreatePage={handleCreatePage}
          onDeletePage={handleDeletePage}
          onSelectPage={handleSelectPage}
        />
      </main>
    </div>
  )
}