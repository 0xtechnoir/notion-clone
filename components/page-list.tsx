'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Trash2 } from 'lucide-react'

interface Page {
  id: string
  title: string
  slug?: string
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

interface PageListProps {
  pages: Page[]
  onCreatePage: (title: string, parentId?: string) => void
  onDeletePage: (id: string) => void
  onSelectPage: (page: Page) => void
}

export function PageList({ pages, onCreatePage, onDeletePage, onSelectPage }: PageListProps) {
  const [newPageTitle, setNewPageTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      onCreatePage(newPageTitle.trim())
      setNewPageTitle('')
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Page title..."
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePage()
                  if (e.key === 'Escape') {
                    setIsCreating(false)
                    setNewPageTitle('')
                  }
                }}
                autoFocus
              />
              <Button onClick={handleCreatePage} disabled={!newPageTitle.trim()}>
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setNewPageTitle('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pages yet. Create your first page to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader
                className="pb-3"
                onClick={() => onSelectPage(page)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(page.updatedAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeletePage(page.id)
                      }}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {page.children.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {page.children.length} child page{page.children.length !== 1 ? 's' : ''}
                  </div>
                )}
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}