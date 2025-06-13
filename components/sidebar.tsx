'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  Home,
  Search,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Page {
  id: string
  title: string
  slug?: string
  parentId?: string
  children: Page[]
}

interface SidebarProps {
  pages: Page[]
  onCreatePage: (title: string, parentId?: string) => void
  onSelectPage: (pageId: string) => void
  selectedPageId?: string
}

function PageTreeItem({ 
  page, 
  onCreatePage, 
  onSelectPage, 
  selectedPageId,
  level = 0 
}: {
  page: Page
  onCreatePage: (title: string, parentId?: string) => void
  onSelectPage: (pageId: string) => void
  selectedPageId?: string
  level?: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = page.children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer group",
          selectedPageId === page.id && "bg-accent",
        )}
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        ) : (
          <div className="w-4" />
        )}
        
        <FileText className="h-4 w-4 text-muted-foreground" />
        
        <span 
          className="truncate flex-1"
          onClick={() => onSelectPage(page.id)}
        >
          {page.title}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onCreatePage('Untitled', page.id)
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {page.children.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              onCreatePage={onCreatePage}
              onSelectPage={onSelectPage}
              selectedPageId={selectedPageId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ pages, onCreatePage, onSelectPage, selectedPageId }: SidebarProps) {
  // Convert flat pages to tree structure
  const buildPageTree = (pages: Page[]): Page[] => {
    const pageMap = new Map<string, Page>()
    const rootPages: Page[] = []

    // First pass: create map of all pages
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] })
    })

    // Second pass: build tree structure
    pages.forEach(page => {
      const pageWithChildren = pageMap.get(page.id)!
      if (page.parentId) {
        const parent = pageMap.get(page.parentId)
        if (parent) {
          parent.children.push(pageWithChildren)
        } else {
          rootPages.push(pageWithChildren)
        }
      } else {
        rootPages.push(pageWithChildren)
      }
    })

    return rootPages
  }

  const pageTree = buildPageTree(pages)

  return (
    <div className="w-64 border-r bg-muted/5 flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">N</span>
          </div>
          <span className="font-semibold">Notion Clone</span>
        </div>
        
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Pages</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onCreatePage('Untitled')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-0.5">
            {pageTree.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No pages yet
              </div>
            ) : (
              pageTree.map((page) => (
                <PageTreeItem
                  key={page.id}
                  page={page}
                  onCreatePage={onCreatePage}
                  onSelectPage={onSelectPage}
                  selectedPageId={selectedPageId}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}