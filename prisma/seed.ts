import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  // Create a test workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'test-workspace' },
    update: {},
    create: {
      id: 'workspace-1',
      name: 'Test Workspace',
      slug: 'test-workspace',
    },
  })

  // Add user to workspace
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'owner',
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })